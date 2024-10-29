import { http, HttpResponse } from 'msw';

export const userInfoV2Handler = http.get('/min-side-arbeidsgiver/api/userInfo/v2', () =>
    HttpResponse.json({
        altinnError: false,
        organisasjoner: [
            {
                orgNr: '121488424',
                name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                organizationForm: 'AS',
                underenheter: [
                    {
                        orgNr: '182345674',
                        underenheter: [],
                        name: 'BALLSTAD OG HAMARØY',
                        organizationForm: 'AAFY',
                    },
                    {
                        orgNr: '118345674',
                        underenheter: [],
                        name: 'BALLSTAD OG HORTEN',
                        organizationForm: 'FLI',
                    },
                    {
                        orgNr: '999999999',
                        name: 'SALTRØD OG HØNEBY',
                        organizationForm: 'BEDR',
                        underenheter: [],
                    },
                ],
            },
            {
                orgNr: '812345674',
                name: 'En Juridisk Ehhet AS',
                organizationForm: 'AS',
                underenheter: [
                    {
                        orgNr: '119985432',
                        underenheter: [],
                        name: 'NAV ENGERDAL',
                        organizationForm: 'BEDR',
                    },
                    {
                        orgNr: '119988432',
                        underenheter: [],
                        name: 'NAV HAMAR',
                        organizationForm: 'BEDR',
                    },
                ],
            },
            {
                orgNr: '119845674',
                name: 'TEST AV AAFY',
                organizationForm: 'AAFY',
                underenheter: [],
            },
            {
                orgNr: '112233445',
                name: 'Andeby kommune',
                organizationForm: 'KOMM',
                underenheter: [
                    {
                        orgNr: '112233345',
                        name: 'Andeby Mellomorganisasjon',
                        organizationForm: 'ORGL',
                        underenheter: [
                            {
                                orgNr: '112223345',
                                name: 'Andeby barnehagestyrer',
                                organizationForm: 'ORGL',
                                underenheter: [
                                    {
                                        orgNr: '111223345',
                                        name: 'Andeby barnehage',
                                        organizationForm: 'BEDR',
                                        underenheter: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                orgNr: '123988321',
                name: 'BJØRNØYA OG ROVDE REVISJON',
                organizationForm: 'AS',
                underenheter: [
                    {
                        orgNr: '321988123',
                        underenheter: [],
                        name: 'ARENDAL OG BØNES REVISJON',
                        organizationForm: 'BEDR',
                    },
                    {
                        orgNr: '311288223',
                        underenheter: [],
                        name: 'GRAVDAL OG SOLLIA REVISJON',
                        organizationForm: 'BEDR',
                    },
                ],
            },
        ],
        tilganger: {
            '5216:1': ['182345674', '118345674', '119985432', '119988432'], // sykefraværsstatistikk
            '4936:1': ['182345674', '118345674', '119985432', '119988432'], // inntektsmelding
            '5384:1': ['182345674', '999999999'], // ekspertbistand
            '4826:1': ['182345674', '999999999'], // utsendtArbeidstakerEØS
            '5332:1': ['182345674', '999999999'], // arbeidstrening
            '5441:1': ['182345674', '999999999'], // arbeidsforhold
            '5516:1': ['182345674', '999999999'], // midlertidigLønnstilskudd
            '5516:2': ['182345674', '999999999'], // varigLønnstilskudd
            '5516:3': ['182345674', '999999999'], // sommerjobb
            '5516:4': ['182345674', '999999999'], // mentortilskudd
            '5516:5': ['182345674', '999999999'], // inkluderingstilskudd
            '3403:1': ['182345674', '999999999'], // sykefravarstatistikk
            '5934:1': ['182345674', '999999999'], // forebyggefravar
            '5078:1': ['182345674', '999999999'], // rekruttering
            '5278:1': ['182345674', '999999999'], // tilskuddsbrev
            '5902:1': ['182345674', '999999999'], // yrkesskade
        },
        digisyfoError: false,
        digisyfoOrganisasjoner: [
            {
                organisasjon: {
                    OrganizationNumber: '999999999',
                    Name: 'Saltrød og Høneby',
                    ParentOrganizationNumber: '121488424',
                    OrganizationForm: 'BEDR',
                },
                antallSykmeldte: 0,
            },
            {
                organisasjon: {
                    OrganizationNumber: '121488424',
                    Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                    ParentOrganizationNumber: null,
                    OrganizationForm: 'AS',
                },
                antallSykmeldte: 0,
            },
            {
                organisasjon: {
                    Name: 'BALLSTAD OG HAMARØY',
                    OrganizationForm: 'AAFY',
                    OrganizationNumber: '182345674',
                    ParentOrganizationNumber: '118345674',
                },
                antallSykmeldte: 4,
            },
            {
                organisasjon: {
                    Name: 'BALLSTAD OG HORTEN',
                    ParentOrganizationNumber: null,
                    OrganizationNumber: '118345674',
                    OrganizationForm: 'FLI',
                },
                antallSykmeldte: 0,
            },
            {
                organisasjon: {
                    Name: 'BareSyfo Virksomhet',
                    OrganizationForm: 'AAFY',
                    OrganizationNumber: '121212121',
                    ParentOrganizationNumber: '111111111',
                },
                antallSykmeldte: 4,
            },
            {
                organisasjon: {
                    Name: 'BareSyfo Juridisk',
                    ParentOrganizationNumber: null,
                    OrganizationNumber: '111111111',
                    OrganizationForm: 'FLI',
                },
                antallSykmeldte: 4,
            },
        ],
        refusjoner: [
            {
                virksomhetsnummer: '999999999',
                statusoversikt: {
                    KLAR_FOR_INNSENDING: 3,
                    FOR_TIDLIG: 1,
                },
                tilgang: true,
            },
            {
                virksomhetsnummer: '121488424',
                statusoversikt: {
                    KLAR_FOR_INNSENDING: 1,
                    FOR_TIDLIG: 2,
                },
                tilgang: true,
            },
            {
                virksomhetsnummer: '182345674',
                statusoversikt: {
                    FOR_TIDLIG: 2,
                },
                tilgang: true,
            },
        ],
    })
);
