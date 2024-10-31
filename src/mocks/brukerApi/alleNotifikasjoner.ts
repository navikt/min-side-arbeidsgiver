import { KalenderavtaleTilstand, OppgaveTilstand } from '../../api/graphql-types';
import { beskjed, dateInPast, kalenderavtale, oppgave } from './helpers';

export const alleNotifikasjoner = [
    oppgave({
        tekst: 'Les og godkjenn avtalen for at den skal kunne tas i bruk',
        klikketPaa: false,
        tilstand: OppgaveTilstand.Ny,
        sakTittel: 'Avtale om lønnstilskudd for Venstrehendt Gitarist',
    }),
    oppgave({
        tekst: 'Send inntektsmelding',
        tilstand: OppgaveTilstand.Utfoert,
        utfoertTidspunkt: dateInPast({ days: 1 }),
        sakTittel: 'Inntektsmelding for sykepenger Tulla Tullesen - f. 01.05.2001',
        tilleggsinformasjon: 'Avtalen gjaldt sykdomsperiode 01.09.2024 - 01.09.2024',
    }),
    beskjed({
        tekst: 'Du har fått svar fra veileder',
        sakTittel: 'Avtale om lønnstilskudd - Akrobatisk admiral',
        opprettetTidspunkt: dateInPast({ days: 2 }),
    }),
    oppgave({
        tekst: 'Send inntektsmelding',
        tilstand: OppgaveTilstand.Utgaatt,
        utgaattTidspunkt: dateInPast({ days: 3 }),
        frist: dateInPast({ days: 2 }),
        sakTittel: 'Inntektsmelding for sykepenger Fetter Anton - f. 12.03.1999',
    }),
    kalenderavtale({
        klikketPaa: false,
        tekst: 'Dialogmøte Dolly',
        startTidspunkt: dateInPast({ days: 4 }),
        lokasjon: {
            adresse: 'Thorvald Meyers gate 2B',
            postnummer: '0473',
            poststed: 'Oslo',
            __typename: 'Lokasjon',
        },
        digitalt: true,
        avtaletilstand: KalenderavtaleTilstand.ArbeidsgiverHarGodtatt,
        sakTittel: 'Søknad om fritak fra arbeidsgiverperioden – kronisk sykdom Gylden Karneval',
    }),
];
