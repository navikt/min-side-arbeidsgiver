import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import 'unorm/lib/unorm';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import { init as Sentry } from '@sentry/browser';
import App from './App/App';
import './index.less';
import environment from './utils/environment';
import raf from 'raf'
import smoothscroll from 'smoothscroll-polyfill';

raf.polyfill();
smoothscroll.polyfill();

const commithash = process.env.GIT_COMMIT_HASH ?? ''
const isMockApp = (process.env.REACT_APP_MOCK ?? '').length > 0

Sentry({
    dsn: 'https://57108359840e4a28b979e36baf5e5c6c@sentry.gc.nav.no/27',
    release: commithash === '' ? 'unknown' : commithash,
    environment: window.location.hostname,
});

if (isMockApp) {
    console.log('========================================');
    console.log('=============== MED MOCK ===============');
    console.log('== DETTE SKAL DU IKKE SE I PRODUKSJON ==');
    console.log('========================================');
    require('./mock/pamMock');
    require('./mock/syfoMock');
    require('./mock/altinnMock');
    require('./mock/altinnMeldingsboksMock');
    require('./mock/unleashMock');
    require('./mock/altinnBeOmTilgangMock')
}

if (isMockApp || environment.MILJO === 'dev-sbs') {
    require('./mock/enhetsRegisteretMock');
}

ReactDOM.render(<App />, document.getElementById('root'));
