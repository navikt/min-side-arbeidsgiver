import React, { FC, ReactNode, useContext, useEffect } from 'react';
import { act, findByTestId, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Hovedside from '../Pages/Hovedside/Hovedside';
import { SWRConfig } from 'swr';
import { AlertsProvider } from '../Pages/Alerts';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonerOgTilgangerProvider,
} from '../Pages/OrganisasjonerOgTilgangerProvider';
import {
    OrganisasjonsDetaljerContext,
    OrganisasjonsDetaljerProvider,
} from '../Pages/OrganisasjonDetaljerProvider';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { MemoryRouter } from 'react-router-dom';

describe('Hovedside', () => {
    it('Bruker med alle tilganger får ikke a11y feil', async () => {
        vi.useFakeTimers();
        const { container } = render(
            <ComponentTestEnabler>
                <Hovedside />
            </ComponentTestEnabler>
        );

        await act(async () => {
            try {
                await vi.runAllTimersAsync(); // run all timers so all fetches can finish
            } catch (error) {
                // prevent throw due to all timers not finishing
            }
            vi.useRealTimers();
        });

        expect(await findByTestId(container, 'valgt-organisasjon')).toBeInTheDocument();
        expect(await axe(container)).toHaveNoViolations();
    }, 10_000);
});

const MedValgtOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { valgtOrganisasjon, endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    useEffect(() => {
        if (valgtOrganisasjon !== undefined) return;
        endreOrganisasjon(organisasjoner['182345674'].organisasjon);
    }, [valgtOrganisasjon, organisasjoner]);

    return valgtOrganisasjon === undefined ? null : (
        <>
            <span data-testid="valgt-organisasjon">
                {valgtOrganisasjon.organisasjon.OrganizationNumber}
            </span>
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
