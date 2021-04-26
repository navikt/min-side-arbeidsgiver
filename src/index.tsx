import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import raf from 'raf'
import { init as Sentry } from '@sentry/browser';
import 'unorm/lib/unorm';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import smoothscroll from 'smoothscroll-polyfill';
import environment, {gittMiljo} from './utils/environment';
import App from './App/App';

raf.polyfill();
smoothscroll.polyfill();

const commithash = process.env.GIT_COMMIT_HASH ?? ''
const isMockApp = (process.env.REACT_APP_MOCK ?? '').length > 0

Sentry({
    dsn: 'https://57108359840e4a28b979e36baf5e5c6c@sentry.gc.nav.no/27',
    release: commithash === '' ? 'unknown' : commithash,
    environment: window.location.hostname,
    enabled: gittMiljo({prod: true, other: false})
});

if (isMockApp) {
    console.log('========================================');
    console.log('=============== MED MOCK ===============');
    console.log('== DETTE SKAL DU IKKE SE I PRODUKSJON ==');
    console.log('========================================');
    require('./mock/pamMock').mock();
    require('./mock/syfoMock').mock();
    require('./mock/altinnMock').mock();
    require('./mock/altinnMeldingsboksMock').mock();
    require('./mock/unleashMock').mock();
    require('./mock/altinnBeOmTilgangMock').mock();
}

if (isMockApp || environment.MILJO === 'dev-gcp' ) {
    require('./mock/enhetsRegisteretMock').mock();
}
if ( environment.MILJO === 'labs-gcp') {
    require('./mock/enhetsRegisteretMock').mock();
    require('./mock/altinnMock').mock();
    require('./mock/altinnMeldingsboksMock').mock();
}

ReactDOM.render(<App />, document.getElementById('root'));
