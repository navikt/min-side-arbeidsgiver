import React, { FC, ReactNode, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { SWRConfig } from 'swr';
import { MemoryRouter } from 'react-router-dom';
import { AlertsProvider } from '../../../Alerts';
import { OrganisasjonerOgTilgangerProvider } from '../../../OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerProvider } from '../../../OrganisasjonsDetaljerProvider';
import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { faker } from '@faker-js/faker';
import NarmesteLederSykefravar from './NarmesteLederSykefravar';
import { createApolloClient } from '../../../Pages';
import { ApolloProvider } from '@apollo/client';

const TEST_ORGNR = '182345674';

const server = setupServer(
    http.get(`${__BASE_PATH__}/api/userInfo/v3`, () =>
        HttpResponse.json({
            altinnError: false,
            organisasjoner: [
                {
                    orgnr: '900000001',
                    roller: [],
                    underenheter: [
                        {
                            orgnr: TEST_ORGNR,
                            roller: [],
                            underenheter: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'BEDR',
                        },
                    ],
                    navn: faker.company.name(),
                    organisasjonsform: 'AS',
                },
            ],
            tilganger: {
                'nav_syfo_oppgi-narmesteleder': [TEST_ORGNR],
            },
            digisyfoError: false,
            digisyfoOrganisasjoner: [],
            refusjoner: [],
        })
    ),
    // Midlertidig endepunkt – team-esyfo lager et mer spesifikt endepunkt senere.
    http.get(`${__BASE_PATH__}/esyfo-narmesteleder/api/v1/linemanager/requirement`, () =>
        HttpResponse.json({ meta: { total: 7 } })
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('NarmesteLederSykefravar', () => {
    it('viser antall sykmeldte mangler leder fra meta.total', async () => {
        render(
            <TestWrapper>
                <NarmesteLederSykefravar />
            </TestWrapper>
        );

        expect(await screen.findByText('7')).toBeInTheDocument();
        expect(await screen.findByText('sykmeldte mangler leder')).toBeInTheDocument();
    });
});

const VelgOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const { valgtOrganisasjon, endreOrganisasjon } = useOrganisasjonsDetaljerContext();

    useEffect(() => {
        if (valgtOrganisasjon.organisasjon.orgnr === TEST_ORGNR) return;
        const org = organisasjonsInfo[TEST_ORGNR];
        if (org !== undefined) endreOrganisasjon(org.organisasjon);
    }, [valgtOrganisasjon, organisasjonsInfo]);

    return <>{children}</>;
};

const TestWrapper: FC<{ children: ReactNode }> = ({ children }) => (
    <MemoryRouter>
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <AlertsProvider>
                <ApolloProvider
                    client={createApolloClient(`${__BASE_PATH__}/api/notifikasjon-bruker-api`)}
                >
                    <OrganisasjonerOgTilgangerProvider>
                        <OrganisasjonsDetaljerProvider>
                            <VelgOrganisasjon>{children}</VelgOrganisasjon>
                        </OrganisasjonsDetaljerProvider>
                    </OrganisasjonerOgTilgangerProvider>
                </ApolloProvider>
            </AlertsProvider>
        </SWRConfig>
    </MemoryRouter>
);
