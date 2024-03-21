import React from 'react';
import { createRoot } from 'react-dom/client';
import environment, { gittMiljo } from './utils/environment';
import '@navikt/ds-css';
import '@navikt/arbeidsgiver-notifikasjon-widget/lib/esm/index.css';
import Pages from './Pages/Pages';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import { initializeFaro } from '@grafana/faro-web-sdk';

window.localStorage.removeItem('ForebyggeFraværInfoBoksLukket');
window.localStorage.removeItem('InntektsmeldingUndersøkelse');
window.localStorage.removeItem('DigiSyfoBedriftsmenyInfoLukket');

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
}).catch((e) => {
    console.error('#MSA: injectDecoratorClientSide feilet', e);
});

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
