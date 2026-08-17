import React, { FC, ReactNode, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { SWRConfig } from 'swr';
import { MemoryRouter } from 'react-router';
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
    http.get(`${__BASE_PATH__}/esyfo-narmesteleder/internal/api/v1/linemanager/statistics`, () =>
        HttpResponse.json({
            employeesOnSickLeaveWithoutLinemanager: 7,
            employeesOnSickLeaveWithLinemanager: 0,
            employeesNotOnSickLeaveWithLinemanager: 0,
        })
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('NarmesteLederSykefravar', () => {
    it('viser antall sykmeldte mangler leder fra statistikk-endepunktet', async () => {
        render(
            <TestWrapper>
                <NarmesteLederSykefravar />
            </TestWrapper>
        );

        expect(await screen.findByText('7')).toBeInTheDocument();
        expect(await screen.findByText('sykmeldte mangler leder')).toBeInTheDocument();
    });

    it('viser ikke boksen når antall er 0', async () => {
        server.use(
            http.get(`${__BASE_PATH__}/esyfo-narmesteleder/internal/api/v1/linemanager/statistics`, () =>
                HttpResponse.json({
                    employeesOnSickLeaveWithoutLinemanager: 0,
                    employeesOnSickLeaveWithLinemanager: 0,
                    employeesNotOnSickLeaveWithLinemanager: 0,
                })
            )
        );

        render(
            <TestWrapper>
                <NarmesteLederSykefravar />
            </TestWrapper>
        );

        await waitFor(() =>
            expect(screen.queryByText('sykmeldte mangler leder')).not.toBeInTheDocument()
        );
    });

    it('viser boksen når minst ett av statistikktallene er over 0', async () => {
        server.use(
            http.get(`${__BASE_PATH__}/esyfo-narmesteleder/internal/api/v1/linemanager/statistics`, () =>
                HttpResponse.json({
                    employeesOnSickLeaveWithoutLinemanager: 0,
                    employeesOnSickLeaveWithLinemanager: 2,
                    employeesNotOnSickLeaveWithLinemanager: 1,
                })
            )
        );

        render(
            <TestWrapper>
                <NarmesteLederSykefravar />
            </TestWrapper>
        );

        expect(await screen.findByText('sykmeldte mangler leder')).toBeInTheDocument();
        expect(await screen.findByText('0')).toBeInTheDocument();
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
