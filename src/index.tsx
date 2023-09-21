import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import 'whatwg-fetch';
import environment, { gittMiljo } from './utils/environment';
import '@navikt/ds-css';
import App from './App/App';
import * as SentryTypes from '@sentry/types';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';

class SentryDebugTransport implements SentryTypes.Transport {
    close(timeout?: number): PromiseLike<boolean> {
        return Promise.resolve(true);
    }

    sendEvent(event: SentryTypes.Event): PromiseLike<SentryTypes.Response> {
        console.error('would have sent to sentry', event);
        return Promise.resolve({ status: 'success' });
    }
}

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
    ignoreErrors: [
        'Error: Failed to fetch',
        'TypeError: Failed to fetch',
        'Error: NetworkError when attempting to fetch resource.',
        'TypeError: NetworkError when attempting to fetch resource.',
        'Error: Load failed',
        'TypeError: Load failed',
        'Error: cancelled',
        'TypeError: cancelled',
        'Error: avbrutt',
        'TypeError: avbrutt',
        'Error: cancelado',
        'TypeError: cancelado',
        'Error: anulowane',
        'TypeError: anulowane',
        'Error: avbruten',
        'TypeError: avbruten',
        'Error: anulat',
        'TypeError: anulat',
        'Error: The operation was aborted.',
        'AbortError: The operation was aborted.',
    ],
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

ReactDOM.render(
    gittMiljo({
        prod: <App />,
        other: (
            <React.StrictMode>
                {' '}
                <App />{' '}
            </React.StrictMode>
        ),
    }),
    document.getElementById('root')
);
