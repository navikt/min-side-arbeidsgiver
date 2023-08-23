import 'react-app-polyfill/ie11';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';
import * as Sentry from '@sentry/react';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import environment, {gittMiljo} from './utils/environment';
import '@navikt/ds-css';
import App from './App/App';
import * as SentryTypes from '@sentry/types';
import {injectDecoratorClientSide} from '@navikt/nav-dekoratoren-moduler'

raf.polyfill();
smoothscroll.polyfill();

class SentryDebugTransport implements SentryTypes.Transport {
    close(timeout?: number): PromiseLike<boolean> {
        return Promise.resolve(true);
    }

    sendEvent(event: SentryTypes.Event): PromiseLike<SentryTypes.Response> {
        console.error("would have sent to sentry", event)
        return Promise.resolve({status: "success"});
    }
}

Sentry.init({
    dsn: 'https://57108359840e4a28b979e36baf5e5c6c@sentry.gc.nav.no/27',
    release: environment.GIT_COMMIT,
    environment: window.location.hostname,
    autoSessionTracking: false,
    ...gittMiljo<SentryTypes.Options>({
        prod: {},
        other: {
            transport: SentryDebugTransport,
        }
    }),
    ignoreErrors: [
        "Error: Failed to fetch",
        "TypeError: Failed to fetch",
        "Error: NetworkError when attempting to fetch resource.",
        "TypeError: NetworkError when attempting to fetch resource.",
        "Error: Load failed",
        "TypeError: Load failed",
        "Error: cancelled",
        "TypeError: cancelled",
        "Error: avbrutt",
        "TypeError: avbrutt",
        "Error: cancelado",
        "TypeError: cancelado",
        "Error: anulowane",
        "TypeError: anulowane",
        "Error: avbruten",
        "TypeError: avbruten",
        "Error: anulat",
        "TypeError: anulat",
        "Error: The operation was aborted.",
        "AbortError: The operation was aborted.",
    ],
});

injectDecoratorClientSide({
    env: gittMiljo({
        prod: "prod",
        other: "dev",
    }),
    urlLookupTable: false,
    context: 'arbeidsgiver',
    redirectToApp: true,
    level: 'Level4'
}).catch(Sentry.captureException);

ReactDOM.render(
    gittMiljo({
        prod: <App/>,
        other: <React.StrictMode> <App/> </React.StrictMode>
    }),
    document.getElementById('root')
);


