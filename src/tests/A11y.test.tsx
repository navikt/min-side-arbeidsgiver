import React, { FC, ReactNode } from 'react';
import { getByText, render, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import Hovedside from '../Pages/Hovedside/Hovedside';
import { SWRConfig } from 'swr';
import { AlertsProvider } from '../Pages/Alerts';
import { OrganisasjonerOgTilgangerProvider } from '../Pages/OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerProvider } from '../Pages/OrganisasjonDetaljerProvider';
import { basename } from '../paths';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { MemoryRouter } from 'react-router-dom';

describe('Hovedside', () => {
    it('Bruker med alle tilganger får ikke a11y feil', async () => {
        const { container } = render(
            <TestWrapper>
                <Hovedside />
            </TestWrapper>
        );
        await waitFor(() => {
            expect(
                getByText(container, 'Lær om tilganger og varsler i Altinn')
            ).toBeInTheDocument();
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MemoryRouter>
            <NotifikasjonWidgetProvider
                miljo={'local'}
                apiUrl={`${basename}/notifikasjon-bruker-api`}
            >
                <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
                    <AlertsProvider>
                        <OrganisasjonerOgTilgangerProvider>
                            <OrganisasjonsDetaljerProvider>
                                {children}
                            </OrganisasjonsDetaljerProvider>
                        </OrganisasjonerOgTilgangerProvider>
                    </AlertsProvider>
                </SWRConfig>
            </NotifikasjonWidgetProvider>
        </MemoryRouter>
    );
};
