import { http, HttpResponse } from 'msw';

export const altinnTilgangerHandler = http.get(
    '/min-side-arbeidsgiver/api/altinn-tilganger',
    () =>
        HttpResponse.json({
            isError: false,
            hierarki: [
                {
                    orgnr: '123456780',
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
                            orgnr: '123456789',
                            navn: 'Eksempel AS Avd Oslo',
                            organisasjonsform: 'BEDR',
                            altinn3Tilganger: ['nav_test_ressurs'],
                            altinn2Tilganger: ['3403:1'],
                            roller: [
                                { kode: 'DAGL', visningsnavn: 'Daglig leder' },
                                { kode: 'LEDE', visningsnavn: 'Styrets leder' },
                            ],
                            underenheter: [],
                        },
                    ],
                },
            ],
            orgNrTilTilganger: {
                '123456789': ['nav_test_ressurs', '3403:1'],
            },
            tilgangTilOrgNr: {
                nav_test_ressurs: ['123456789'],
                '3403:1': ['123456789'],
            },
        })
);
