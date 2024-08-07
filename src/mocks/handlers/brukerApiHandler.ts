import { buildASTSchema, graphql as executeGraphQL } from 'graphql';
import { graphql, HttpResponse } from 'msw';
import Document from '../../../bruker.graphql';
import { fakerNB_NO as faker } from '@faker-js/faker';
import {
    alleMerkelapper,
    beskjedTidslinjeElement,
    kalenderavtaleTidslinjeElement,
    oppgaveTidslinjeElement,
    oppgaveTilstandInfo,
    sakStatus,
    virksomhet,
} from '../faker/brukerApiHelpers';
import {
    BeskjedTidslinjeElement,
    KalenderavtaleTidslinjeElement,
    KalenderavtaleTilstand,
    OppgaveTidslinjeElement,
    OppgaveTilstand,
    SakStatusType,
} from '../../api/graphql-types';

const schema = buildASTSchema(Document);

const fixOpprettetTidspunkt = (
    tidslinje: (
        | BeskjedTidslinjeElement
        | KalenderavtaleTidslinjeElement
        | OppgaveTidslinjeElement
    )[]
): (BeskjedTidslinjeElement | KalenderavtaleTidslinjeElement | OppgaveTidslinjeElement)[] => {
    const tidspunkter = tidslinje
        .flatMap((element) => {
            if ('opprettetTidspunkt' in element) return [element.opprettetTidspunkt];
            return [];
        })
        .sort();
    return tidslinje.map((element, index) => {
        if ('opprettetTidspunkt' in element) {
            const neste = tidspunkter.pop();
            return { ...element, opprettetTidspunkt: neste };
        }
        return element;
    });
};

const saker = [
    {
        id: faker.string.uuid(),
        merkelapp: 'Fritak i arbeidsgiverperioden',
        tittel: 'Refusjon fritak i arbeidsgiverperioden - gravid ansatt - Fyndig Hare f.25.04.91',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Fritak i arbeidsgiverperioden',
        tittel: 'Refusjon fritak i arbeidsgiverperioden - gravid ansatt - Stadig Sten f.01.11.99',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        nesteSteg: null,
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: faker.date.recent({ days: 2 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Fritak i arbeidsgiverperioden',
        tittel: 'Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - Logisk Simulering f.01.05.82',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Fritak i arbeidsgiverperioden',
        tittel: 'Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - Sint Brosme f.12.11.62',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        nesteSteg: null,
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: faker.date.recent({ days: 2 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Lønnstilskudd',
        tittel: 'Avtale om lønnstilskudd Fyndig Hare',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Utkast',
        }),
        nesteSteg: null,
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: faker.date.recent({ days: 2 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Lønnstilskudd',
        tittel: 'Avtale om lønnstilskudd Grode Frodås Lavterskel',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        nesteSteg: null,
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 7 }),
                paaminnelseTidspunkt: faker.date.recent({ days: 2 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Lønnstilskudd',
        tittel: 'Avtale om lønnstilskudd Grode Frodås Lavterskel 2',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        nesteSteg: null,
        tidslinje: [
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til samtale med veileder 15 april ',
                avtaletilstand: KalenderavtaleTilstand.VenterSvarFraArbeidsgiver,
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
            beskjedTidslinjeElement({
                tekst: 'Du har fått svar fra veileder på meldingen din. ',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er godkjent av alle parter og kan tas i bruk. ',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 7 }),
                paaminnelseTidspunkt: faker.date.recent({ days: 2 }),
                utfoertTidspunkt: faker.date.recent({ days: 1 }),
                tilstand: OppgaveTilstand.Ny,
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Dialogmøte',
        tittel: 'Dialogmøte Fyndig hare',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Planlagt',
        }),
        nesteSteg: null,
        tidslinje: [
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.VenterSvarFraArbeidsgiver,
                lokasjon: undefined,
                digitalt: false,
                startTidspunkt: new Date('2024-06-20T15:15:00'),
                sluttTidspunkt: new Date('2024-06-20T16:15:00'),
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilAvlyse,
                digitalt: false,
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
                lokasjon: undefined,
                digitalt: true,
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.Avlyst,
                lokasjon: undefined,
                digitalt: false,
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Dialogmøte',
        tittel: 'Dialogmøte Ullen Glasskule',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Gjennomført',
        }),
        nesteSteg: null,
        tidslinje: [
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
        ],
    },
].map((sak) => ({ ...sak, tidslinje: fixOpprettetTidspunkt(sak.tidslinje) }));

export const brukerApiHandlers = [
    graphql.query('hentSaker', async ({ query, variables }) => {
        const sakerFiltrert = saker.filter(({ merkelapp }) =>
            (variables.sakstyper ?? alleMerkelapper)?.includes(merkelapp)
        );
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                saker: {
                    saker: sakerFiltrert.length > 0 ? sakerFiltrert : saker,
                    sakstyper: alleMerkelapper.map((navn) => ({
                        navn,
                        antall: faker.number.int(100),
                    })),
                    feilAltinn: false,
                    totaltAntallSaker: faker.number.int(1000),
                    oppgaveTilstandInfo: oppgaveTilstandInfo(),
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
                            startTidspunkt: '2024-06-20T15:15:00',
                            sluttTidspunkt: '2024-06-20T16:15:00',
                            avtaletilstand: 'VENTER_SVAR_FRA_ARBEIDSGIVER',
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
                            tekst: 'Dialogmøte Tastbar telefon',
                            startTidspunkt: '2024-06-30T12:15:00',
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
                            startTidspunkt: '2024-07-05T15:15:00',
                            sluttTidspunkt: '2024-07-05T16:15:00',
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
                            startTidspunkt: '2024-08-04T15:15:00',
                            sluttTidspunkt: null,
                            avtaletilstand: 'ARBEIDSGIVER_VIL_AVLYSE',
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
                sakstyper: alleMerkelapper.map((navn) => ({ navn })),
            },
        });

        return HttpResponse.json({ errors, data });
    }),
];
