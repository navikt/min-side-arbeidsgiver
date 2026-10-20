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
import Arbeidsforhold from './Arbeidsforhold';
import { createApolloClient } from '../../../Pages';
import { ApolloProvider } from '@apollo/client';

const JURIDISK_ENHET = '900000001';
const ORGANISASJONSLEDD = '900000002';
const UNDERENHET = '182345674';

const ARBEIDSSTEDOVERSIKT_URL = `${__BASE_PATH__}/aareg-services/arbeidsstedoversikt`;

type Forespørsel = { opplysningspliktigId: string; arbeidsstedId: string };
let forespørsler: Forespørsel[] = [];

const svarFor =
    (svar: Record<string, object | undefined>) =>
    async ({ request }: { request: Request }) => {
        const body = (await request.json()) as Forespørsel;
        forespørsler.push(body);
        const treff = svar[body.opplysningspliktigId];
        return treff === undefined ? new HttpResponse(null, { status: 200 }) : HttpResponse.json(treff);
    };

const server = setupServer(
    http.get(`${__BASE_PATH__}/api/userInfo/v3`, () =>
        HttpResponse.json({
            altinnError: false,
            organisasjoner: [
                {
                    orgnr: JURIDISK_ENHET,
                    roller: [],
                    navn: faker.company.name(),
                    organisasjonsform: 'AS',
                    underenheter: [
                        {
                            orgnr: ORGANISASJONSLEDD,
                            roller: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'ORGL',
                            underenheter: [
                                {
                                    orgnr: UNDERENHET,
                                    roller: [],
                                    underenheter: [],
                                    navn: faker.company.name(),
                                    organisasjonsform: 'BEDR',
                                },
                            ],
                        },
                    ],
                },
            ],
            tilganger: {},
            digisyfoError: false,
            digisyfoOrganisasjoner: [],
            refusjoner: [],
        })
    )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
beforeEach(() => {
    forespørsler = [];
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Arbeidsforhold', () => {
    it('viser aktive + inaktive arbeidsforhold fra nærmeste opplysningspliktige', async () => {
        server.use(
            http.post(
                ARBEIDSSTEDOVERSIKT_URL,
                svarFor({
                    [ORGANISASJONSLEDD]: { aktiveArbeidsforhold: 30, inaktiveArbeidsforhold: 12 },
                })
            )
        );

        render(
            <TestWrapper>
                <Arbeidsforhold />
            </TestWrapper>
        );

        expect(await screen.findByText('42')).toBeInTheDocument();
        expect(forespørsler).toEqual([
            { opplysningspliktigId: ORGANISASJONSLEDD, arbeidsstedId: UNDERENHET },
        ]);
    });

    it('prøver neste nivå i treet når aareg-services svarer uten body', async () => {
        server.use(
            http.post(
                ARBEIDSSTEDOVERSIKT_URL,
                svarFor({
                    [JURIDISK_ENHET]: { aktiveArbeidsforhold: 5, inaktiveArbeidsforhold: 2 },
                })
            )
        );

        render(
            <TestWrapper>
                <Arbeidsforhold />
            </TestWrapper>
        );

        expect(await screen.findByText('7')).toBeInTheDocument();
        expect(forespørsler).toEqual([
            { opplysningspliktigId: ORGANISASJONSLEDD, arbeidsstedId: UNDERENHET },
            { opplysningspliktigId: JURIDISK_ENHET, arbeidsstedId: UNDERENHET },
        ]);
    });

    it('viser ingen arbeidsforhold når ingen nivå i treet gir treff', async () => {
        server.use(http.post(ARBEIDSSTEDOVERSIKT_URL, svarFor({})));

        render(
            <TestWrapper>
                <Arbeidsforhold />
            </TestWrapper>
        );

        await waitFor(() => expect(forespørsler).toHaveLength(2));
        expect(await screen.findByText('-')).toBeInTheDocument();
    });
});

const VelgOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const { valgtOrganisasjon, endreOrganisasjon } = useOrganisasjonsDetaljerContext();

    useEffect(() => {
        if (valgtOrganisasjon.organisasjon.orgnr === UNDERENHET) return;
        const org = organisasjonsInfo[UNDERENHET];
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
