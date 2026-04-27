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
                    roller: [
                        { kode: 'DAGL', visningsnavn: 'Daglig leder' },
                        { kode: 'LEDE', visningsnavn: 'Styrets leder' },
                    ],
                    tilgangspakker: ['regnskapsfoerer', 'revisor'],
                    underenheter: [
                        {
                            orgnr: '100000002',
                            navn: 'Eksempel FLI',
                            organisasjonsform: 'FLI',
                            altinn3Tilganger: ['nav_test_ressurs'],
                            roller: [{ kode: 'DAGL', visningsnavn: 'Daglig leder' }],
                            tilgangspakker: [],
                            underenheter: [],
                        },
                        {
                            orgnr: '100000010',
                            navn: 'Eksempel ORGL',
                            organisasjonsform: 'ORGL',
                            altinn3Tilganger: [],
                            roller: [],
                            tilgangspakker: [],
                            underenheter: [
                                {
                                    orgnr: '100000011',
                                    navn: 'Eksempel ORGL underenhet',
                                    organisasjonsform: 'ORGL',
                                    altinn3Tilganger: [],
                                    roller: [],
                                    tilgangspakker: [],
                                    underenheter: [
                                        {
                                            orgnr: '100000001',
                                            navn: 'Eksempel AAFY',
                                            organisasjonsform: 'AAFY',
                                            altinn3Tilganger: [],
                                            roller: [
                                                { kode: 'LEDE', visningsnavn: 'Styrets leder' },
                                            ],
                                            tilgangspakker: [],
                                            underenheter: [],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
            ressursMetadata: {
                nav_test_ressurs: {
                    metadata: {
                        identifier: 'nav_test_ressurs',
                        title: {
                            nb: 'Test ressurs',
                            nn: 'Test ressurs nn',
                            en: 'Test resource',
                        },
                        rightDescription: {
                            nb: 'Gir tilgang til test ressurs',
                            nn: null,
                            en: null,
                        },
                        resourceType: 'GenericAccessResource',
                        status: 'Completed',
                        delegable: true,
                    },
                    grantedByRoles: ['dagl'],
                    grantedByAccessPackages: [],
                },
            },
        })
);
