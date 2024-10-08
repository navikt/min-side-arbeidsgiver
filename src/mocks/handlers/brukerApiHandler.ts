import { buildASTSchema, graphql as executeGraphQL } from 'graphql';
import { graphql, HttpResponse } from 'msw';
import Document from '../../../bruker.graphql';
import { fakerNB_NO as faker } from '@faker-js/faker';
import {
    alleMerkelapper,
    beskjed,
    beskjedTidslinjeElement,
    kalenderavtale,
    kalenderavtaleTidslinjeElement,
    oppgave,
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

export const schema = buildASTSchema(Document);

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

export const saker = [
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
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 7 }),
                tilstand: OppgaveTilstand.Utfoert,
                utfoertTidspunkt: faker.date.recent({ days: 4 }),
                frist: faker.date.soon({ days: 7 }),
            }),
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
                tilstand: OppgaveTilstand.Ny,
                frist: faker.date.soon({ days: 7 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: faker.date.past({ years: 1 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 29 }),
                frist: faker.date.recent({ days: 1 }),
                tilstand: OppgaveTilstand.Utfoert,
                utfoertTidspunkt: faker.date.recent({ days: 7 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 29 }),
                frist: faker.date.recent({ days: 1 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: faker.date.recent({ days: 7 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: faker.date.recent({ days: 29 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: faker.date.recent({ days: 7 }),
            }),
        ],
    },
    {
        id: faker.string.uuid(),
        merkelapp: 'Lønnstilskudd',
        tittel: 'Avtale om lønnstilskudd Gert Snabel',
        lenke: '#',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        nesteSteg: 'Vi sender deg en melding innen 24. desember',
        tidslinje: [],
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
                startTidspunkt: faker.date.soon({ days: 7 }),
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
                startTidspunkt: faker.date.soon({ days: 1 }),
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilAvlyse,
                startTidspunkt: faker.date.soon({ days: 1 }),
                digitalt: false,
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilEndreTidEllerSted,
                startTidspunkt: faker.date.soon({ days: 1 }),

                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
                digitalt: false,
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
                startTidspunkt: faker.date.soon({ days: 1 }),
                lokasjon: undefined,
                digitalt: true,
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
                startTidspunkt: faker.date.recent({ days: 1 }),
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
                        oppgave({
                            tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk',
                            klikketPaa: false,
                            tilstand: OppgaveTilstand.Ny,
                            sakTittel: 'Avtale om lønnstilskudd for Venstrehendt Gitarist',
                        }),
                        oppgave({
                            tekst: 'Send inntektsmelding',
                            tilstand: OppgaveTilstand.Utfoert,
                            utfoertTidspunkt: faker.date.recent({ days: 1 }),
                            sakTittel:
                                'Inntektsmelding for sykepenger Tulla Tullesen - f. 01.05.2001',
                            tilleggsinformasjon:
                                'Avtalen gjaldt sykdomsperiode 01.09.2024 - 01.09.2024',
                        }),
                        beskjed({
                            tekst: 'Du har fått svar fra veileder',
                            sakTittel: 'Avtale om lønnstilskudd - Akrobatisk admiral',
                            opprettetTidspunkt: faker.date.recent({ days: 2 }),
                        }),
                        oppgave({
                            tekst: 'Send inntektsmelding',
                            tilstand: OppgaveTilstand.Utgaatt,
                            utgaattTidspunkt: faker.date.recent({ days: 3 }),
                            frist: faker.date.recent({ days: 3 }),
                            sakTittel:
                                'Inntektsmelding for sykepenger Fetter Anton - f. 12.03.1999',
                        }),
                        kalenderavtale({
                            klikketPaa: false,
                            tekst: 'Dialogmøte Dolly',
                            startTidspunkt: faker.date.recent({ days: 4 }),
                            lokasjon: {
                                adresse: 'Thorvald Meyers gate 2B',
                                postnummer: '0473',
                                poststed: 'Oslo',
                                __typename: 'Lokasjon',
                            },
                            digitalt: true,
                            avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
                            sakTittel:
                                'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Gylden Karneval',
                        }),
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
