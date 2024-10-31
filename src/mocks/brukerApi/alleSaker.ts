import { fakerNB_NO as faker } from '@faker-js/faker';
import { KalenderavtaleTilstand, OppgaveTilstand, SakStatusType } from '../../api/graphql-types';
import {
    beskjedTidslinjeElement,
    dateInPast,
    fdato,
    kalenderavtaleTidslinjeElement,
    oppgaveTidslinjeElement,
    sak,
    sakStatus,
    virksomhet,
} from './helpers';
import { Merkelapp } from './alleMerkelapper';

export const alleSaker = [
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - gravid ansatt - ${faker.person.fullName()} f.${fdato()}`,
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
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - gravid ansatt - ${faker.person.fullName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: dateInPast({ days: 1 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: dateInPast({ years: 1 }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - ${faker.person.fullName()} f.${fdato()}`,
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
    }),
    sak({
        merkelapp: Merkelapp.Fritak_i_arbeidsgiverperioden,
        tittel: `Refusjon fritak i arbeidsgiverperioden - kronisk sykdom - ${faker.person.fullName()} f.${fdato()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Ferdig,
            tekst: 'Utbetalt',
        }),
        tidslinje: [
            beskjedTidslinjeElement({
                tekst: 'NAV har utbetalt refusjonen',
                opprettetTidspunkt: dateInPast({ days: 2 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'NAV har mottat ditt refusjonskrav',
                opprettetTidspunkt: dateInPast({ years: 1 }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${faker.person.fullName()}`,
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
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ days: 2 }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${faker.person.fullName()}`,
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
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ months: 1 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ months: 2 }),
                frist: dateInPast({ months: 1, days: 7 }),
                tilstand: OppgaveTilstand.Utfoert,
                utfoertTidspunkt: dateInPast({ months: 1, days: 7 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ months: 3 }),
                frist: dateInPast({ months: 2, days: 1 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: dateInPast({ months: 2, days: 7 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ years: 1, months: 1 }),
                tilstand: OppgaveTilstand.Utgaatt,
                utgaattTidspunkt: dateInPast({ years: 1 }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Lønnstilskudd,
        tittel: `Avtale om lønnstilskudd ${faker.person.fullName()}`,
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
        tittel: `Avtale om lønnstilskudd ${faker.person.fullName()}`,
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
                lokasjon: {
                    adresse: 'Sørkedalsveien 31',
                    postnummer: '0788',
                    poststed: 'Sandnes',
                },
            }),
            beskjedTidslinjeElement({
                tekst: 'Du har fått svar fra veileder på meldingen din. ',
                opprettetTidspunkt: dateInPast({ months: 1 }),
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er godkjent av alle parter og kan tas i bruk. ',
                opprettetTidspunkt: dateInPast({ months: 5 }),
            }),
            oppgaveTidslinjeElement({
                tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk.',
                opprettetTidspunkt: dateInPast({ days: 7, months: 6 }),
                paaminnelseTidspunkt: dateInPast({ days: 2, months: 6 }),
                utfoertTidspunkt: dateInPast({ days: 1, months: 6 }),
                tilstand: OppgaveTilstand.Ny,
            }),
            beskjedTidslinjeElement({
                tekst: 'Avtalen er opprettet og nå kan alle deltagere fylle den ut. ',
                opprettetTidspunkt: dateInPast({ years: 1 }),
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Dialogmøte,
        tittel: `Dialogmøte ${faker.person.fullName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Planlagt',
        }),
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
                startTidspunkt: dateInPast({ days: 1 }),
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
    }),
    sak({
        merkelapp: Merkelapp.Dialogmøte,
        tittel: `Dialogmøte ${faker.person.fullName()}`,
        virksomhet: virksomhet(),
        sisteStatus: sakStatus({
            type: SakStatusType.Mottatt,
            tekst: 'Gjennomført',
        }),
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
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${faker.person.fullName()} f.${fdato()}`,
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
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${faker.person.fullName()} f.${fdato()}`,
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
            }),
        ],
    }),
    sak({
        merkelapp: Merkelapp.Inntektsmelding_sykepenger,
        tittel: `Inntektsmelding for ${faker.person.fullName()} f.${fdato()}`,
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
            }),
        ],
    }),
];
