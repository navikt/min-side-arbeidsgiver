import { buildASTSchema, graphql as executeGraphQL } from 'graphql';
import { graphql, HttpResponse } from 'msw';
import Document from '../../../bruker.graphql';

console.log(Document);
const schema = buildASTSchema(Document);

export const brukerApiHandlers = [
    graphql.query('hentSaker', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                saker: {
                    saker: [
                        {
                            id: '8f774b17-2202-4256-87b9-e67b439adad3',
                            merkelapp: 'quas harum qui doloremque nobis illum molestiae',
                            tittel: 'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Akrobatisk Admiral',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer:
                                    'possimus molestiae nihil sapiente aut maiores dolores',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'FERDIG',
                                tekst: 'Under behandling',
                                tidspunkt: '2024-05-14T10:45:57.456Z',
                                __typename: 'SakStatus',
                            },
                            nesteSteg: null,
                            tidslinje: [],
                            __typename: 'Sak',
                        },
                        {
                            id: '9b7440dd-8567-45bd-a4b5-1c67a6a3a203',
                            merkelapp: 'pariatur quod quia perferendis quas quasi animi',
                            tittel: 'Lønnskompensasjon ved permittering TEST',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer: 'est aliquam veritatis in eius ad quia',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'MOTTATT',
                                tekst: 'Mottatt',
                                tidspunkt: '2024-05-06T10:11:57.458Z',
                                __typename: 'SakStatus',
                            },
                            nesteSteg: null,
                            tidslinje: [
                                {
                                    __typename: 'BeskjedTidslinjeElement',
                                    id: '0.af0xwjgicw',
                                    tekst: 'Søknad om lønnskompensasjon ved innskrenkning i arbeidstiden sendt',
                                    opprettetTidspunkt: '2024-05-13T16:33:57.456Z',
                                },
                            ],
                            __typename: 'Sak',
                        },
                        {
                            id: '8c251a26-267f-45d8-bab7-1f8a87918dbf',
                            merkelapp: 'qui repellat voluptatem qui voluptates neque consequatur',
                            tittel: 'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Gylden Karneval\n',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer:
                                    'voluptatibus perspiciatis quidem deleniti numquam corporis quae',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'MOTTATT',
                                tekst: 'Mottatt',
                                tidspunkt: '2024-05-20T10:12:57.458Z',
                                __typename: 'SakStatus',
                            },
                            nesteSteg: 'Denne saken vil bli behandlet innen 1. juli.',
                            tidslinje: [
                                {
                                    __typename: 'OppgaveTidslinjeElement',
                                    id: '0.28lm22bthmi',
                                    tekst: 'Avtale forlenget av veileder.',
                                    tilstand: 'UTFOERT',
                                    frist: '2024-05-01T11:10:57.458Z',
                                    opprettetTidspunkt: '2024-05-30T11:10:57.458Z',
                                    paaminnelseTidspunkt: null,
                                    utfoertTidspunkt: '2023-04-18T00:09:15.693Z',
                                    utgaattTidspunkt: null,
                                },
                                {
                                    __typename: 'OppgaveTidslinjeElement',
                                    id: '0.uog3ebe9s6',
                                    tekst: 'Kontaktinformasjon i avtale endret av veileder.',
                                    tilstand: 'NY',
                                    frist: '2024-05-04T11:10:57.458Z',
                                    opprettetTidspunkt: '2024-05-26T11:10:57.458Z',
                                    paaminnelseTidspunkt: null,
                                    utfoertTidspunkt: null,
                                    utgaattTidspunkt: null,
                                },
                            ],
                            __typename: 'Sak',
                        },
                        {
                            id: '0d15ad98-b10c-48d7-b7b8-adebab2d4cb9',
                            merkelapp:
                                'facilis dignissimos officia voluptatum aperiam aperiam nihil',
                            tittel: 'Varsel om permittering 12 ansatte TEST',
                            lenke: '#',
                            virksomhet: {
                                navn: 'Gamle Fredikstad og Riksdalen regnskap',
                                virksomhetsnummer: 'dolorum labore ad ea labore officia quis',
                                __typename: 'Virksomhet',
                            },
                            sisteStatus: {
                                type: 'UNDER_BEHANDLING',
                                tekst: 'Under behandling',
                                tidspunkt: '2024-05-19T10:10:57.458Z',
                                __typename: 'SakStatus',
                            },
                            nesteSteg: null,
                            tidslinje: [],
                            __typename: 'Sak',
                        },
                    ],
                    sakstyper: [
                        {
                            navn: 'Inntektsmelding',
                            antall: 8,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Permittering',
                            antall: 3,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Masseoppsigelse',
                            antall: 7,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Innskrenkning i arbeidstiden',
                            antall: 5,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Yrkesskade',
                            antall: 7,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Lønnstilskudd',
                            antall: 2,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Mentor',
                            antall: 5,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Sommerjobb',
                            antall: 2,
                            __typename: 'Sakstype',
                        },
                        {
                            navn: 'Arbeidstrening',
                            antall: 1,
                            __typename: 'Sakstype',
                        },
                    ],
                    feilAltinn: false,
                    totaltAntallSaker: 314,
                    oppgaveTilstandInfo: [
                        {
                            tilstand: 'UTGAATT',
                            antall: 546,
                            __typename: 'OppgaveTilstandInfo',
                        },
                        {
                            tilstand: 'NY',
                            antall: 550,
                            __typename: 'OppgaveTilstandInfo',
                        },
                    ],
                    __typename: 'SakerResultat',
                },
            },
        });

        return HttpResponse.json({ errors, data });
    }),
    graphql.query('HentKalenderavtaler', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                kommendeKalenderavtaler: {
                    avtaler: [
                        {
                            id: '70a7eaf2-6f63-4d47-94ac-e467002ad82c',
                            tekst: 'Dialogmøte Sprø Plekter',
                            startTidspunkt: '2021-02-04T15:15:00',
                            sluttTidspunkt: null,
                            avtaletilstand: 'ARBEIDSGIVER_VIL_AVLYSE',
                            lokasjon: {
                                adresse: 'Thorvald Meyers gate 2B',
                                postnummer: '0473',
                                poststed: 'Oslo',
                                __typename: 'Lokasjon',
                            },
                            digitalt: false,
                            lenke: 'quam voluptatem consequatur facilis maxime dolorum deleniti',
                            __typename: 'Kalenderavtale',
                        },
                        {
                            id: '0f6b0dd3-7f25-4950-95a8-9b8ad58372f6',
                            tekst: 'Dialogmøte Tastbar Kalender',
                            startTidspunkt: '2021-02-04T15:15:00',
                            sluttTidspunkt: null,
                            avtaletilstand: 'ARBEIDSGIVER_HAR_GODTATT',
                            lokasjon: null,
                            digitalt: true,
                            lenke: 'numquam voluptate exercitationem reiciendis repudiandae laudantium qui',
                            __typename: 'Kalenderavtale',
                        },
                        {
                            id: 'f8f7753c-d222-4e33-8d2c-2d2211094d04',
                            tekst: 'Dialogmøte Sjalu Streng',
                            startTidspunkt: '2021-02-04T15:15:00',
                            sluttTidspunkt: '2021-02-04T16:15:00',
                            avtaletilstand: 'ARBEIDSGIVER_VIL_ENDRE_TID_ELLER_STED',
                            lokasjon: {
                                adresse: 'Thorvald Meyers gate 2B',
                                postnummer: '0473',
                                poststed: 'Oslo',
                                __typename: 'Lokasjon',
                            },
                            digitalt: false,
                            lenke: 'et minus aut nisi suscipit culpa ullam',
                            __typename: 'Kalenderavtale',
                        },
                        {
                            id: '0cccbfb2-b69f-4901-880c-0028fc597a81',
                            tekst: 'Dialogmøte Myk Penn',
                            startTidspunkt: '2021-02-04T15:15:00',
                            sluttTidspunkt: null,
                            avtaletilstand: 'VENTER_SVAR_FRA_ARBEIDSGIVER',
                            lokasjon: null,
                            digitalt: false,
                            lenke: 'iusto dolore commodi iure fugiat sint illum',
                            __typename: 'Kalenderavtale',
                        },
                        {
                            id: '196d2931-5766-44b9-b41d-28071551890b',
                            tekst: 'Dialogmøte Lukket Ballong',
                            startTidspunkt: '2021-02-04T15:15:00',
                            sluttTidspunkt: '2021-02-04T16:15:00',
                            avtaletilstand: 'AVLYST',
                            lokasjon: null,
                            digitalt: true,
                            lenke: 'asperiores voluptate quis ex beatae aut vero',
                            __typename: 'Kalenderavtale',
                        },
                    ],
                    __typename: 'KalenderavtalerResultat',
                },
            },
        });

        return HttpResponse.json({ errors, data });
    }),
    graphql.query('hentNotifikasjoner', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                notifikasjoner: {
                    feilAltinn: false,
                    feilDigiSyfo: false,
                    notifikasjoner: [
                        {
                            __typename: 'Beskjed',
                            brukerKlikk: {
                                id: 'c64c2123-2de6-4701-b0d6-5c8c07d4bb7c',
                                klikketPaa: true,
                                __typename: 'BrukerKlikk',
                            },
                            virksomhet: {
                                navn: 'Storfonsa og Fredrikstad Regnskap',
                                virksomhetsnummer: 'id laudantium non amet nostrum quis id',
                                __typename: 'Virksomhet',
                            },
                            lenke: '#ut',
                            tekst: 'Søknad om lønnskompensasjon ved permittering sendt',
                            merkelapp: 'Permittering',
                            opprettetTidspunkt: '2024-05-28T06:20:12.674Z',
                            sorteringTidspunkt: '2024-05-28T06:20:12.674Z',
                            id: '0.ugf71e25isj',
                            sak: null,
                        },
                        {
                            __typename: 'Beskjed',
                            brukerKlikk: {
                                id: '303312ea-2e9c-4d72-bb83-165384398786',
                                klikketPaa: true,
                                __typename: 'BrukerKlikk',
                            },
                            virksomhet: {
                                navn: 'Ballstad og Hamarøy',
                                virksomhetsnummer:
                                    'eos laboriosam nulla eveniet aliquam voluptas id',
                                __typename: 'Virksomhet',
                            },
                            lenke: '#voluptatem',
                            tekst: 'Inntektsmelding mottatt',
                            merkelapp: 'Inntektsmelding',
                            opprettetTidspunkt: '2024-05-02T08:38:12.674Z',
                            sorteringTidspunkt: '2024-05-28T01:22:12.674Z',
                            id: '0.ot888bk7l8l',
                            sak: {
                                tittel: 'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Akrobatisk Admiral',
                                __typename: 'SakMetadata',
                            },
                        },
                        {
                            __typename: 'Oppgave',
                            brukerKlikk: {
                                id: '493c6c46-c4e4-4f44-98ac-1ad6f449e45c',
                                klikketPaa: true,
                                __typename: 'BrukerKlikk',
                            },
                            virksomhet: {
                                navn: 'Arendal og Bønes Revisjon',
                                virksomhetsnummer: 'ipsam est quam libero aut nihil delectus',
                                __typename: 'Virksomhet',
                            },
                            lenke: '#doloremque',
                            tekst: 'Søknad om yrkesskadeerstatning sendt',
                            merkelapp: 'Yrkesskade',
                            opprettetTidspunkt: '2024-05-24T09:21:12.674Z',
                            sorteringTidspunkt: '2024-05-24T09:21:12.674Z',
                            paaminnelseTidspunkt: null,
                            utgaattTidspunkt: '2024-05-14T09:54:12.674Z',
                            utfoertTidspunkt: '2024-05-30T10:20:10.000Z',
                            tilstand: 'UTGAATT',
                            id: '0.ryzsqbdvs0o',
                            frist: null,
                            sak: null,
                        },
                        {
                            __typename: 'Kalenderavtale',
                            brukerKlikk: {
                                id: 'd09b7178-9d86-431c-8de9-ede6276a5e1a',
                                klikketPaa: false,
                                __typename: 'BrukerKlikk',
                            },
                            virksomhet: {
                                navn: 'Gravdal og Solli Revisjon',
                                virksomhetsnummer:
                                    'incidunt ipsum recusandae veniam facilis laboriosam ad',
                                __typename: 'Virksomhet',
                            },
                            lenke: '#quam',
                            tekst: 'Dialogmøte Dolly',
                            merkelapp: 'Sommerjobb',
                            opprettetTidspunkt: '2024-05-19T10:20:12.674Z',
                            sorteringTidspunkt: '2024-05-19T10:20:12.674Z',
                            startTidspunkt: '2023-08-19T01:16:32.223Z',
                            sluttTidspunkt: null,
                            lokasjon: {
                                adresse: 'Thorvald Meyers gate 2B',
                                postnummer: '0473',
                                poststed: 'Oslo',
                                __typename: 'Lokasjon',
                            },
                            digitalt: true,
                            avtaletilstand: 'ARBEIDSGIVER_HAR_GODTATT',
                            id: '0.uz5ul0zdw1',
                            sak: {
                                tittel: 'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Gylden Karneval\n',
                                __typename: 'SakMetadata',
                            },
                        },
                    ],
                    __typename: 'NotifikasjonerResultat',
                },
            },
        });

        return HttpResponse.json({ errors, data });
    }),
    graphql.query('Sakstyper', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                sakstyper: [
                    {
                        navn: 'Inntektsmelding',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Permittering',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Masseoppsigelse',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Innskrenkning i arbeidstiden',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Yrkesskade',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Lønnstilskudd',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Mentor',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Sommerjobb',
                        __typename: 'SakstypeOverordnet',
                    },
                    {
                        navn: 'Arbeidstrening',
                        __typename: 'SakstypeOverordnet',
                    },
                ],
            },
        });

        return HttpResponse.json({ errors, data });
    }),
];
