import React, { FC, ReactNode, useContext, useEffect } from 'react';
import { getByText, render, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
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
        const { container } = render(
            <ComponentTestEnabler>
                <Hovedside />
            </ComponentTestEnabler>
        );
        await new Promise((r) => setTimeout(r, 3000));
        await waitFor(() => {
            expect(
                getByText(container, 'Lær om tilganger og varsler i Altinn')
            ).toBeInTheDocument();
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});

const MedValgtOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { valgtOrganisasjon, endreOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    useEffect(() => {
        if (valgtOrganisasjon !== undefined) return;
        endreOrganisasjon(organisasjoner['182345674'].organisasjon);
    }, [organisasjoner]);

    return valgtOrganisasjon !== undefined ? children : null;
};

const ComponentTestEnabler: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MemoryRouter>
            <NotifikasjonWidgetProvider
                miljo={'local'}
                apiUrl={`${__BASE_PATH__}/notifikasjon-bruker-api`}
            >
                <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
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
