import React from 'react';
import { createRoot } from 'react-dom/client';
import environment, { gittMiljo } from './utils/environment';
import '@navikt/ds-css';
import '@navikt/arbeidsgiver-notifikasjon-widget/lib/esm/index.css';
import Pages from './Pages/Pages';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import { initializeFaro } from '@grafana/faro-web-sdk';
import { startMSW } from './mocks/msw';

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
        context: 'arbeidsgiver',
        redirectToApp: true,
        level: 'Level4',
        logoutWarning: true,
    },
}).catch((e) => {
    console.error('#MSA: injectDecoratorClientSide feilet', e);
});

const maintainance = gittMiljo({
    prod: false,
    dev: false,
    other: false,
});

const root = createRoot(document.getElementById('app')!);
if (maintainance) {
    root.render(
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <div>
                    <h1>Vi oppdaterer Min side – arbeidsgiver</h1>
                    <p>
                        Vi utfører vedlikehold på Min side – arbeidsgiver. Vi beklager ulempene
                        dette medfører.
                    </p>
                    <p>Vi er tilbake i løpet av kort tid.</p>
                </div>
            </div>
        </>
    );
} else if (import.meta.env.MODE === 'demo') {
    startMSW().then(() =>
        root.render(
            <React.StrictMode>
                <Pages />
            </React.StrictMode>
        )
    );
} else {
    root.render(<Pages />);
}
