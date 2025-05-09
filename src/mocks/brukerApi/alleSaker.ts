import { fakerNB_NO as faker } from '@faker-js/faker';
import { KalenderavtaleTilstand, OppgaveTilstand, SakStatusType } from '../../api/graphql-types';
import {
    beskjedTidslinjeElement,
    dateInPast,
    fakeName,
    fdato,
    kalenderavtaleTidslinjeElement,
    oppgaveTidslinjeElement,
    sak,
    sakStatus,
    virksomhet,
} from './helpers';
import { Merkelapp } from './alleMerkelapper';

let currentDaysPast = 1;
export const alleSaker = [
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - gravid ansatt - ${fakeName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        lenke: null,
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                tekst: 'NAV har utbetalt refusjonen',
                lenke: `https://foo.bar`,
            }),
            beskjedTidslinjeElement({
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                tekst: 'NAV har mottat ditt refusjonskrav',
                lenke: `${__BASE_PATH__}/sak`,
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - gravid ansatt - ${fakeName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: dateInPast({ years: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - ${fakeName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                tekst: 'NAV har mottat ditt refusjonskrav',
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - ${fakeName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: dateInPast({ years: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Utkast',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ days: 7 }),
                tilstand: OppgaveTilstand.Utfoert,
                utfoertTidspunkt: dateInPast({ days: 4 }),
                frist: faker.date.soon({ days: 7 }),
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ days: 2 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ days: 7 }),
                tilstand: OppgaveTilstand.Ny,
                frist: faker.date.soon({ days: 7 }),
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ months: 1 }),
                lenke: faker.internet.url(),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ months: 2 }),
                frist: dateInPast({ months: 1, days: 7 }),
                tilstand: OppgaveTilstand.Utfoert,
                utfoertTidspunkt: dateInPast({ months: 1, days: 7 }),
                lenke: faker.internet.url(),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ months: 3 }),
                frist: dateInPast({ months: 2, days: 1 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: dateInPast({ months: 2, days: 7 }),
                lenke: faker.internet.url(),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ years: 1, months: 1 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: dateInPast({ years: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        nesteSteg: 'Vi sender deg en melding innen 24. desember',
        tidslinje: [],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Under gjennomføring',
        }),
        tidslinje: [
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til samtale med veileder 15 april ',
                avtaletilstand: KalenderavtaleTilstand.VenterSvarFraArbeidsgiver,
                startTidspunkt: faker.date.soon({ days: 7 }),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                lenke: faker.internet.url(),
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
            beskjedTidslinjeElement({
                tekst: 'Du har fått svar fra veileder på meldingen din. ',
                opprettetTidspunkt: dateInPast({ months: 1 }),
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er godkjent av alle parter og kan tas i bruk. ',
                opprettetTidspunkt: dateInPast({ months: 5 }),
                lenke: faker.internet.url(),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ days: 7, months: 6 }),
                paaminnelseTidspunkt: dateInPast({ days: 2, months: 6 }),
                utfoertTidspunkt: dateInPast({ days: 1, months: 6 }),
                tilstand: OppgaveTilstand.Ny,
                lenke: faker.internet.url(),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ years: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Dialogmøte,
        tittel: `Dialogmøte ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Planlagt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                tekst: 'Du har mottatt et referat fra dialogmøte',
                lenke: faker.internet.url(),
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.Avlyst,
                startTidspunkt: faker.date.soon({ days: 1 }),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
                digitalt: false,
                lenke: faker.internet.url(),
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverVilEndreTidEllerSted,
                startTidspunkt: faker.date.soon({ days: 1 }),
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
                digitalt: false,
                lenke: faker.internet.url(),
            }),
            kalenderavtaleTidslinjeElement({
                tekst: 'Invitasjon til dialogmøte',
                avtaletilstand: KalenderavtaleTilstand.VenterSvarFraArbeidsgiver,
                startTidspunkt: faker.date.soon({ days: 1 }),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
                digitalt: false,
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Oppfølging,
        tittel: `Oppfølging av ${fakeName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Planlagt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'Vi har mottatt ditt ønske om dialogmøte med Nav. Vi vurderer at det på nåværende tidspunkt ikke er aktuelt at Nav kaller inn til et dialogmøte. Du kan når som helst melde inn et nytt behov i sykefraværsperioden.',
                lenke: faker.internet.url(),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Oppfølgingsplan til godkjenning',
                lenke: faker.internet.url(),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Vi trenger en oppfølgingsplan fra deg',
                lenke: faker.internet.url(),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Vi trenger din vurdering av behovet for dialogmøte.',
                lenke: faker.internet.url(),
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${fakeName()} f.${fdato()}`,
        tilleggsinformasjon: `Sykemeldingsperiode: ${dateInPast({ days: 15 }).toLocaleDateString()} - ${dateInPast({ days: 1 }).toLocaleDateString()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Venter på inntektsmelding',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Innsending av inntektsmelding',
                tilstand: OppgaveTilstand.Ny,
                opprettetTidspunkt: dateInPast({ days: 15 }),
                paaminnelseTidspunkt: dateInPast({ days: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${fakeName()} f.${fdato()}`,
        tilleggsinformasjon: `Sykemeldingsperiode: ${dateInPast({ days: 15 }).toLocaleDateString()} - ${dateInPast({ days: 1 }).toLocaleDateString()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.UnderBehandling,
            tekst: 'Venter på inntektsmelding',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Innsending av inntektsmelding',
                tilstand: OppgaveTilstand.Ny,
                opprettetTidspunkt: dateInPast({ days: 15 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${fakeName()} f.${fdato()}`,
        tilleggsinformasjon: `Sykemeldingsperiode: ${dateInPast({ months: 1, days: 15 }).toLocaleDateString()} - ${dateInPast({ months: 1, days: 1 }).toLocaleDateString()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt - se kvittering eller korriger inntektsmelding',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Innsending av inntektsmelding',
                tilstand: OppgaveTilstand.Utfoert,
                opprettetTidspunkt: dateInPast({ months: 1, days: 15 }),
                utfoertTidspunkt: dateInPast({ months: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${fakeName()} f.${fdato()}`,
        tilleggsinformasjon: `Sykemeldingsperiode: ${dateInPast({ months: 2, days: 15 }).toLocaleDateString()} - ${dateInPast({ months: 2, days: 1 }).toLocaleDateString()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Avbrutt av Nav',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Innsending av inntektsmelding',
                tilstand: OppgaveTilstand.Utgaatt,
                opprettetTidspunkt: dateInPast({ months: 2, days: 15 }),
                utgaattTidspunkt: dateInPast({ months: 2 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_pleiepenger_sykt_barn,
        tittel: `Inntektsmelding for ${fakeName()} (${fdato()})`,
        tilleggsinformasjon: `For første fraværsdag ${dateInPast({ months: 2, days: 15 }).toLocaleDateString()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: '',
        }),
        tidslinje: [
            oppgaveTidslinjeElement({
                tekst: 'Innsending av inntektsmelding for pleiepenger sykt barn',
                tilstand: OppgaveTilstand.Ny,
                opprettetTidspunkt: dateInPast({ months: 2, days: 15 }),
                paaminnelseTidspunkt: dateInPast({ days: 1 }),
                lenke: faker.internet.url(),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Lenkeløs sak`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        lenke: null,
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'Notifikasjon har lenke',
                lenke: `https://foo.bar`,
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Notifikasjon har lenke til saksside',
                lenke: `${__BASE_PATH__}/sak`,
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: 'Sak med lenke',
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Mottatt',
        }),
        lenke: 'https://foo.bar',
        nesteSteg: 'Saksbehandlingstiden er lang. Du kan forvente refusjon utbetalt i januar 2025.',
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'Notifikasjonen har samme lenke som sak',
                lenke: `https://foo.bar`,
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Notifikasjonen har lenke til saksside',
                lenke: `${__BASE_PATH__}/sak`,
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Notifikasjonen har en annen lenke enn sak',
                lenke: 'https://bar.foo',
                opprettetTidspunkt: dateInPast({ days: currentDaysPast++ }),
            }),
        ],
    }),
];
