import { expect } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
    useBeregnOrganisasjonsInfo,
    useBeregnOrganisasjonstre,
} from './OrganisasjonerOgTilgangerContext';
import { act, renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { AlertsProvider } from './Alerts';
import { OrganisasjonerOgTilgangerProvider } from './OrganisasjonerOgTilgangerProvider';
import { MemoryRouter } from 'react-router-dom';

describe('OrganisasjonerOgTilgangerContext', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('useBeregnOrganisasjonstre fletter altinn og digisyfo tilganger riktig', async () => {
        server.use(
            http.get(`${__BASE_PATH__}/api/userInfo/v3`, () =>
                HttpResponse.json({
                    organisasjoner: [
                        {
                            orgnr: '1',
                            navn: '1',
                            organisasjonsform: 'AS',
                            roller: ['LEDE'],
                            underenheter: [
                                {
                                    orgnr: '1.1',
                                    navn: '1.1',
                                    organisasjonsform: 'ORGL',
                                    roller: [],
                                    underenheter: [
                                        {
                                            orgnr: '1.1.1',
                                            navn: '1.1.1',
                                            organisasjonsform: 'BEDR',
                                            roller: [],
                                            underenheter: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    digisyfoOrganisasjoner: [
                        {
                            orgnr: '1',
                            navn: '1',
                            organisasjonsform: 'AS',
                            antallSykmeldte: 0,
                            underenheter: [
                                {
                                    orgnr: '1.2',
                                    navn: '1.2',
                                    organisasjonsform: 'ORGL',
                                    antallSykmeldte: 0,
                                    underenheter: [
                                        {
                                            orgnr: '1.2.1',
                                            navn: '1.2.1',
                                            organisasjonsform: 'BEDR',
                                            antallSykmeldte: 0,
                                            underenheter: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    tilganger: {},
                    altinnError: false,
                    digisyfoError: false,
                    refusjoner: [],
                })
            )
        );
        vi.useFakeTimers();
        const { result } = renderHook(() => useBeregnOrganisasjonstre(), {
            wrapper: ({ children }: { children: ReactNode }) => {
                return (
                    <SWRConfig
                        value={{
                            dedupingInterval: 0,
                            provider: () => new Map(),
                            shouldRetryOnError: (err) => {
                                // liten hack for å tvinge evt. fetch error til å bli logget
                                // krever disableConsoleIntercept: true
                                console.error(err);
                                return false;
                            },
                        }}
                    >
                        <AlertsProvider>
                            <MemoryRouter>
                                <OrganisasjonerOgTilgangerProvider>
                                    {children}
                                </OrganisasjonerOgTilgangerProvider>
                            </MemoryRouter>
                        </AlertsProvider>
                    </SWRConfig>
                );
            },
        });
        await act(async () => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        expect(result.current?.organisasjonstre).toEqual([
            {
                orgnr: '1',
                navn: '1',
                organisasjonsform: 'AS',
                roller: ['LEDE'],
                underenheter: [
                    {
                        orgnr: '1.1',
                        navn: '1.1',
                        organisasjonsform: 'ORGL',
                        roller: [],
                        underenheter: [
                            {
                                orgnr: '1.1.1',
                                navn: '1.1.1',
                                organisasjonsform: 'BEDR',
                                roller: [],
                                underenheter: [],
                            },
                        ],
                    },
                    {
                        orgnr: '1.2',
                        navn: '1.2',
                        organisasjonsform: 'ORGL',
                        roller: [],
                        underenheter: [
                            {
                                orgnr: '1.2.1',
                                navn: '1.2.1',
                                organisasjonsform: 'BEDR',
                                roller: [],
                                underenheter: [],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('eksponerer roller fra Altinn på organisasjonsinfo', async () => {
        server.use(
            http.get(`${__BASE_PATH__}/api/userInfo/v3`, () =>
                HttpResponse.json({
                    organisasjoner: [
                        {
                            orgnr: '1',
                            navn: '1',
                            organisasjonsform: 'AS',
                            roller: ['LEDE', 'REGNA'],
                            underenheter: [],
                        },
                    ],
                    digisyfoOrganisasjoner: [],
                    tilganger: {},
                    altinnError: false,
                    digisyfoError: false,
                    refusjoner: [],
                })
            )
        );
        vi.useFakeTimers();
        const { result } = renderHook(() => useBeregnOrganisasjonsInfo(), {
            wrapper: ({ children }: { children: ReactNode }) => {
                return (
                    <SWRConfig
                        value={{
                            dedupingInterval: 0,
                            provider: () => new Map(),
                            shouldRetryOnError: (err) => {
                                console.error(err);
                                return false;
                            },
                        }}
                    >
                        <AlertsProvider>
                            {children}
                        </AlertsProvider>
                    </SWRConfig>
                );
            },
        });

        await act(async () => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        expect(result.current.organisasjonsInfo?.['1'].roller).toEqual(['LEDE', 'REGNA']);
        expect(result.current.organisasjonsInfo?.['1'].organisasjon.roller).toEqual([
            'LEDE',
            'REGNA',
        ]);
    });
});

const server = setupServer();
