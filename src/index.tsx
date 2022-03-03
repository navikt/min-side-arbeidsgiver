import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf';
import * as Sentry from '@sentry/react';
import 'unorm/lib/unorm';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import environment, { gittMiljo } from './utils/environment';
import App from './App/App';
import * as SentryTypes from '@sentry/types';

raf.polyfill();
smoothscroll.polyfill();

class SentryDebugTransport implements SentryTypes.Transport {
    close(timeout?: number): PromiseLike<boolean> {
        return Promise.resolve(true);
    }

    sendEvent(event: SentryTypes.Event): PromiseLike<SentryTypes.Response> {
        console.error("would have sent to sentry", event)
        return Promise.resolve({status: "success" });
    }
}

Sentry.init({
    dsn: 'https://57108359840e4a28b979e36baf5e5c6c@sentry.gc.nav.no/27',
    release: environment.GIT_COMMIT,
    environment: window.location.hostname,
    autoSessionTracking: false,
    ... gittMiljo<SentryTypes.Options>({
        prod: {
        },
        other: {
            transport: SentryDebugTransport,
        }
    }),
});

ReactDOM.render(<App />, document.getElementById('root'));
