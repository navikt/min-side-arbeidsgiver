import { http, HttpResponse } from 'msw';

export const altinnTilgangerHandler = http.post(
    '/min-side-arbeidsgiver/api/altinn-tilganger',
    () =>
        HttpResponse.json({
            isError: false,
            hierarki: [
                {
                    orgnr: '100000020',
                    navn: 'Eksempel AS',
                    organisasjonsform: 'AS',
                    altinn3Tilganger: [],
                    altinn2Tilganger: [],
                    roller: [
                        { kode: 'DAGL', visningsnavn: 'Daglig leder' },
                        { kode: 'LEDE', visningsnavn: 'Styrets leder' },
                    ],
                    underenheter: [
                        {
                            orgnr: '100000002',
                            navn: 'Eksempel FLI',
                            organisasjonsform: 'FLI',
                            altinn3Tilganger: ['nav_test_ressurs'],
                            altinn2Tilganger: ['3403:1'],
                            roller: [],
                            underenheter: [],
                        },
                        {
                            orgnr: '100000010',
                            navn: 'Eksempel ORGL',
                            organisasjonsform: 'ORGL',
                            altinn3Tilganger: [],
                            altinn2Tilganger: [],
                            roller: [],
                            underenheter: [
                                {
                                    orgnr: '100000011',
                                    navn: 'Eksempel ORGL underenhet',
                                    organisasjonsform: 'ORGL',
                                    altinn3Tilganger: [],
                                    altinn2Tilganger: [],
                                    roller: [],
                                    underenheter: [
                                        {
                                            orgnr: '100000001',
                                            navn: 'Eksempel AAFY',
                                            organisasjonsform: 'AAFY',
                                            altinn3Tilganger: [],
                                            altinn2Tilganger: [],
                                            roller: [
                                                { kode: 'LEDE', visningsnavn: 'Styrets leder' },
                                            ],
                                            underenheter: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            orgNrTilTilganger: {
                '100000002': ['nav_test_ressurs', '3403:1'],
            },
            tilgangTilOrgNr: {
                nav_test_ressurs: ['100000002'],
                '3403:1': ['100000002'],
            },
        })
);
