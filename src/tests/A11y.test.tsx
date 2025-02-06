import React, { FC, ReactNode, useEffect } from 'react';
import { act, findByTestId, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Hovedside from '../Pages/Hovedside/Hovedside';
import { SWRConfig } from 'swr';
import { AlertsProvider } from '../Pages/Alerts';
import { useOrganisasjonerOgTilgangerContext } from '../Pages/OrganisasjonerOgTilgangerContext';
import { OrganisasjonsDetaljerProvider } from '../Pages/OrganisasjonsDetaljerProvider';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { MemoryRouter } from 'react-router-dom';
import { useOrganisasjonsDetaljerContext } from '../Pages/OrganisasjonsDetaljerContext';
import { OrganisasjonerOgTilgangerProvider } from '../Pages/OrganisasjonerOgTilgangerProvider';
import { server } from './mocks';

describe('Hovedside', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('Bruker med alle tilganger får ikke a11y feil', async () => {
        vi.useFakeTimers();
        const { container } = render(
            <ComponentTestEnabler>
                <Hovedside />
            </ComponentTestEnabler>
        );

        await act(async () => {
            vi.useRealTimers();
        });

        expect(await findByTestId(container, 'valgt-organisasjon')).toBeInTheDocument();
        expect(await axe(container)).toHaveNoViolations();
    }, 10_000);
});

const MedValgtOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const { valgtOrganisasjon, endreOrganisasjon } = useOrganisasjonsDetaljerContext();

    console.error('valgtOrganisasjon', valgtOrganisasjon);
    useEffect(() => {
        console.error('useEffect.valgtOrganisasjon', valgtOrganisasjon);
        if (valgtOrganisasjon.organisasjon.orgnr === '182345674') return;
        endreOrganisasjon(organisasjonsInfo['182345674'].organisasjon);
        console.error('useEffect.endreOrganisasjon', organisasjonsInfo['182345674'].organisasjon);
    }, [valgtOrganisasjon, organisasjonsInfo]);

    return (
        <>
            <span data-testid="valgt-organisasjon">{valgtOrganisasjon.organisasjon.orgnr}</span>
            {children}
        </>
    );
};

const ComponentTestEnabler: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MemoryRouter>
            <NotifikasjonWidgetProvider
                miljo={'local'}
                apiUrl={`${__BASE_PATH__}/notifikasjon-bruker-api`}
            >
                <SWRConfig
                    value={{
                        shouldRetryOnError: (err) => {
                            // liten hack for å tvinge evt. fetch error til å bli logget
                            console.error(err);
                            return false;
                        },
                    }}
                >
                    <AlertsProvider>
                        <OrganisasjonerOgTilgangerProvider>
                            <OrganisasjonsDetaljerProvider>
                                <MedValgtOrganisasjon>{children}</MedValgtOrganisasjon>
                            </OrganisasjonsDetaljerProvider>
                        </OrganisasjonerOgTilgangerProvider>
                    </AlertsProvider>
                </SWRConfig>
            </NotifikasjonWidgetProvider>
        </MemoryRouter>
    );
};
