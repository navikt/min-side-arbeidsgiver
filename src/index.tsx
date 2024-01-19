import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import environment, { gittMiljo } from './utils/environment';
import '@navikt/ds-css';
import Pages from './Pages/Pages';
import * as SentryTypes from '@sentry/types';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import { initializeFaro } from '@grafana/faro-web-sdk';

window.localStorage.removeItem('ForebyggeFraværInfoBoksLukket');
window.localStorage.removeItem('InntektsmeldingUndersøkelse');
window.localStorage.removeItem('DigiSyfoBedriftsmenyInfoLukket');

class SentryDebugTransport implements SentryTypes.Transport {
    close(timeout?: number): PromiseLike<boolean> {
        return Promise.resolve(true);
    }

    sendEvent(event: SentryTypes.Event): PromiseLike<SentryTypes.Response> {
        console.error('would have sent to sentry', event);
        return Promise.resolve({ status: 'success' });
    }
}

initializeFaro({
    url: gittMiljo({
        prod: 'https://telemetry.nav.no/collect',
        dev: 'https://telemetry.ekstern.dev.nav.no/collect',
        other: '/collect',
    }),
    app: {
        name: 'min-side-arbeidsgiver',
        version: environment.GIT_COMMIT,
    },
});

Sentry.init({
    dsn: 'https://57108359840e4a28b979e36baf5e5c6c@sentry.gc.nav.no/27',
    release: environment.GIT_COMMIT,
    environment: window.location.hostname,
    beforeSend: (event) => {
        const sanitize = (url: string) => {
            /* Cleaner solution with `new URL(url)` does not work because of realtive URLs. */

            /* Extract search parameters */
            const search = /\?([^#]*)(#.*)?$/.exec(url)?.[1];
            if (search === undefined) {
                return url;
            }

            /* Sanitize search params */
            const searchParams = new URLSearchParams(search);
            searchParams.forEach((value, key) => {
                searchParams.set(key, value.replaceAll(/./g, '*'));
            });

            /* Reinsert search params */
            return url.replace(/\?([^#]*)((#.*)?)$/, (_match, _search, fragment) => {
                return `?${searchParams.toString()}${fragment}`;
            });
        };

        if (typeof event.request?.url === 'string') {
            event.request.url = sanitize(event.request.url);
        }

        if (typeof event.request?.headers?.Referer === 'string') {
            event.request.headers.Referer = sanitize(event.request.headers.Referer);
        }

        for (const breadcrumb of event.breadcrumbs ?? []) {
            if (typeof breadcrumb.data?.url === 'string') {
                breadcrumb.data.url = sanitize(breadcrumb.data.url);
            }
        }
        return event;
    },
    autoSessionTracking: false,
    ...gittMiljo<SentryTypes.Options>({
        prod: {},
        other: {
            transport: SentryDebugTransport,
        },
    }),
});

injectDecoratorClientSide({
    env: gittMiljo({
        prod: 'prod',
        other: 'dev',
    }),
    params: {
        urlLookupTable: false,
        context: 'arbeidsgiver',
        redirectToApp: true,
        level: 'Level4',
        logoutWarning: true,
    },
}).catch(Sentry.captureException);

const root = createRoot(document.getElementById('app')!);
root.render(
    gittMiljo({
        prod: <Pages />,
        other: (
            <React.StrictMode>
                {' '}
                <Pages />{' '}
            </React.StrictMode>
        ),
    })
);
