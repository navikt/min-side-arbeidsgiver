import { http, HttpResponse } from 'msw';

export const altinnTilgangerHandler = http.post('/min-side-arbeidsgiver/api/altinn-tilganger', () =>
    HttpResponse.json({
        isError: false,
        hierarki: [
            {
                orgnr: '100000020',
                navn: 'YTRE INFOLD KOMMUNE',
                organisasjonsform: 'KOMM',
                altinn3Tilganger: [
                    {
                        ressursId: 'nav_enkelt_ressurs',
                        navn: null,
                        beskrivelse: null,
                        delegertViaRoller: [],
                        delegertViaTilgangspakker: [],
                        erEnkeltrettighet: true,
                    },
                ],
                roller: [
                    {
                        kode: 'DAGL',
                        visningsnavn: 'Daglig leder',
                        beskrivelse:
                            'Personen som er ansvarlig for den daglige driften av selskapet.',
                    },
                    {
                        kode: 'LEDE',
                        visningsnavn: 'Styrets leder',
                        beskrivelse: 'Leder av styret i selskapet.',
                    },
                ],
                tilgangspakker: [],
                underenheter: [],
            },
            {
                orgnr: '100000020',
                navn: 'Eksempel AS',
                organisasjonsform: 'AS',
                altinn3Tilganger: [],
                roller: [
                    {
                        kode: 'DAGL',
                        visningsnavn: 'Daglig leder',
                        beskrivelse:
                            'Personen som er ansvarlig for den daglige driften av selskapet.',
                    },
                    {
                        kode: 'LEDE',
                        visningsnavn: 'Styrets leder',
                        beskrivelse: 'Leder av styret i selskapet.',
                    },
                ],
                tilgangspakker: [
                    {
                        id: 'regnskapsfoerer',
                        navn: 'Regnskapsfører',
                        beskrivelse: 'Tilgang for regnskapsfører',
                        area: {
                            urn: 'accesspackage:area:skatt_avgift_regnskap_og_toll',
                            name: 'Skatt, avgift, regnskap og toll',
                            description: 'Tilgangspakker for skatt, avgift, regnskap og toll',
                        },
                    },
                    {
                        id: 'revisor',
                        navn: 'Revisor',
                        beskrivelse: 'Tilgang for revisor',
                        area: {
                            urn: 'accesspackage:area:skatt_avgift_regnskap_og_toll',
                            name: 'Skatt, avgift, regnskap og toll',
                            description: 'Tilgangspakker for skatt, avgift, regnskap og toll',
                        },
                    },
                ],
                underenheter: [
                    {
                        orgnr: '100000002',
                        navn: 'Eksempel FLI',
                        organisasjonsform: 'FLI',
                        altinn3Tilganger: [
                            {
                                ressursId: 'nav_test_ressurs',
                                navn: {
                                    nb: 'Test ressurs',
                                    nn: 'Test ressurs nn',
                                    en: 'Test resource',
                                },
                                beskrivelse: {
                                    nb: 'Gir tilgang til test ressurs',
                                    nn: null,
                                    en: null,
                                },
                                delegertViaRoller: [
                                    {
                                        kode: 'DAGL',
                                        visningsnavn: 'Daglig leder',
                                        beskrivelse:
                                            'Personen som er ansvarlig for den daglige driften av selskapet.',
                                    },
                                ],
                                delegertViaTilgangspakker: [],
                                erEnkeltrettighet: false,
                            },
                        ],
                        roller: [
                            {
                                kode: 'DAGL',
                                visningsnavn: 'Daglig leder',
                                beskrivelse:
                                    'Personen som er ansvarlig for den daglige driften av selskapet.',
                            },
                        ],
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
                                        altinn3Tilganger: [
                                            {
                                                ressursId: 'nav_enkelt_ressurs',
                                                navn: null,
                                                beskrivelse: null,
                                                delegertViaRoller: [],
                                                delegertViaTilgangspakker: [],
                                                erEnkeltrettighet: true,
                                            },
                                        ],
                                        roller: [
                                            {
                                                kode: 'LEDE',
                                                visningsnavn: 'Styrets leder',
                                                beskrivelse: 'Leder av styret i selskapet.',
                                            },
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
    })
);
