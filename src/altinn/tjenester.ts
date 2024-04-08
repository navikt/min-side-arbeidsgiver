import { gittMiljo } from '../utils/environment';
import * as Record from '../utils/Record';

export type AltinnskjemaId =
    | 'ekspertbistand'
    | 'inntektsmelding'
    | 'utsendtArbeidstakerEØS'
    | 'endreBankkontonummerForRefusjoner';

export type NAVtjenesteId =
    | 'arbeidstrening'
    | 'arbeidsforhold'
    | 'midlertidigLønnstilskudd'
    | 'varigLønnstilskudd'
    | 'sommerjobb'
    | 'mentortilskudd'
    | 'inkluderingstilskudd'
    | 'sykefravarstatistikk'
    | 'forebyggefravar'
    | 'rekruttering'
    | 'tilskuddsbrev'
    | 'yrkesskade';

export interface AltinnFellesInfo {
    navn: string;
    tjenestekode: string;
    tjenesteversjon: string;
    beOmTilgangTittel?: string;
    beOmTilgangBeskrivelse: string /* Fravær av beskrivelse betyr man ikke kan søke om tilgang */;
}

export interface Altinnskjema extends AltinnFellesInfo {
    sort: 'skjema';
    skjemaUrl: string;
}

export interface NAVTjeneste extends AltinnFellesInfo {
    sort: 'tjeneste';
}

export type AltinntjenesteId = AltinnskjemaId | NAVtjenesteId;
export type Altinn = Altinnskjema | NAVTjeneste;

export const altinnskjema: Record<AltinnskjemaId, Altinnskjema> = {
    ekspertbistand: {
        sort: 'skjema',
        navn: 'Ekspertbistand',
        tjenestekode: '5384',
        tjenesteversjon: '1',
        beOmTilgangBeskrivelse: `
            Få tilgang til å søke ekspertbistand i Altinn. Du kan søke om ekspertbistand
            hvis en arbeidstaker har lange og/eller hyppige sykefravær.`,
        skjemaUrl:
            'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-ekspertbistand/',
    },

    inntektsmelding: {
        sort: 'skjema',
        navn: 'Inntektsmelding',
        tjenestekode: '4936',
        tjenesteversjon: '1',
        beOmTilgangBeskrivelse: `
            Få tilgang til å sende digital inntektsmelding når arbeidstakeren skal ha
             sykepenger, foreldrepenger, svangerskapspenger, pleiepenger, omsorgspenger
             eller opplæringspenger.`,
        skjemaUrl:
            'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/',
    },

    utsendtArbeidstakerEØS: {
        sort: 'skjema',
        navn: 'Utsendt arbeidstaker til EØS/Sveits',
        tjenestekode: '4826',
        tjenesteversjon: '1',
        beOmTilgangBeskrivelse: `
            Få tilgang til å søke om attest A1 for avklart
            trygdetilhørighet for arbeidstakere som er midlertidig
            utsendt til et EØS-land eller Sveits.
             `,
        skjemaUrl:
            'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-a1-for-utsendte-arbeidstakeren-innen-eossveits/',
    },

    endreBankkontonummerForRefusjoner: {
        sort: 'skjema',
        navn: 'Endre bankkontonummer for refusjoner fra NAV til arbeidsgiver',
        tjenestekode: '2896',
        tjenesteversjon: '87',
        beOmTilgangBeskrivelse: `
            TODO: Beskrivelse
        `,
        skjemaUrl: 'TODO: beskrivelse',
    },
};

export const navtjenester: Record<NAVtjenesteId, NAVTjeneste> = {
    arbeidstrening: {
        sort: 'tjeneste',
        navn: 'Arbeidstrening',
        beOmTilgangBeskrivelse: `
             Arbeidstrening er et tiltak som gir arbeidssøker
             mulighet til å prøve seg i arbeid, få relevant erfaring
             og skaffe seg en ordinær jobb. Arbeidstrening i din
             bedrift kan bidra til at arbeidssøkeren når målene sine.`,
        tjenestekode: '5332',
        tjenesteversjon: gittMiljo({ prod: '2', other: '1' }),
    },

    arbeidsforhold: {
        sort: 'tjeneste',
        navn: 'Arbeidsforhold',
        beOmTilgangBeskrivelse: `
            Få oversikt over alle arbeidsforhold du som arbeidsgiver har
            rapportert inn via A-meldingen. Her kan du kontrollere opplysningene
            og se hva som er registrert i arbeidsgiver- og arbeidstakerregisteret
            (Aa-registeret).`,
        tjenestekode: '5441',
        tjenesteversjon: '1',
    },

    midlertidigLønnstilskudd: {
        sort: 'tjeneste',
        navn: 'Midlertidig lønnstilskudd',
        beOmTilgangBeskrivelse: `
            Få tilgang til avtaler om midlertidig lønnstilskudd i din virksomhet.
            Lønnstilskudd kan gis dersom du ansetter personer som har problemer
            med å komme inn på arbeidsmarkedet.`,
        tjenestekode: '5516',
        tjenesteversjon: '1',
    },

    varigLønnstilskudd: {
        sort: 'tjeneste',
        navn: 'Varig lønnstilskudd',
        beOmTilgangBeskrivelse: `
                Få tilgang til avtaler om varig lønnstilskudd i din virksomhet.
                Lønnstilskudd kan gis dersom du ansetter personer som har problemer
                med å komme inn på arbeidsmarkedet.`,
        tjenestekode: '5516',
        tjenesteversjon: '2',
    },

    sommerjobb: {
        sort: 'tjeneste',
        navn: 'Sommerjobb',
        beOmTilgangBeskrivelse: `
                Få tilgang til avtaler om sommerjobb i din virksomhet.
                Tilskudd til sommerjobb kan gis dersom du kan tilby sommerjobb til unge arbeidsledige som har fått vurdert av NAV at de har behov for arbeidsrettet bistand.`,
        tjenestekode: '5516',
        tjenesteversjon: '3',
    },

    mentortilskudd: {
        sort: 'tjeneste',
        navn: 'Mentortilskudd',
        tjenestekode: '5516',
        tjenesteversjon: '4',
        beOmTilgangBeskrivelse: `
            Få tilgang til avtaler om mentortilskudd. 
            Du kan søke om mentortilskudd for å få dekket frikjøp av en 
            arbeidskollega som kan gi praktisk hjelp, veiledning og opplæring 
            for personer som gjennomfører arbeidsmarkedstiltak.
            `,
    },

    inkluderingstilskudd: {
        sort: 'tjeneste',
        navn: 'Inkluderingstilskudd',
        tjenestekode: '5516',
        tjenesteversjon: '5',
        beOmTilgangBeskrivelse: `
        Få tilgang til avtaler om inkluderingstilskudd.
        Du kan søke om tilskudd for å dekke merkostnader du som
        arbeidsgiver har ved tilrettelegging av arbeidsplassen.`,
    },

    sykefravarstatistikk: {
        sort: 'tjeneste',
        navn: 'Sykefraværsstatistikk',
        beOmTilgangBeskrivelse: `Oversikt over sykefravær i din virksomhet og bransje.`,
        tjenestekode: '3403',
        tjenesteversjon: gittMiljo({ prod: '2', other: '1' }),
    },

    forebyggefravar: {
        sort: 'tjeneste',
        navn: 'Forebygge fravær',
        beOmTilgangBeskrivelse:
            'Få tilgang til å redigere eller se endringer andre har gjort i planen for å forebygge fravær.',
        tjenestekode: '5934',
        tjenesteversjon: '1',
    },

    rekruttering: {
        sort: 'tjeneste',
        navn: 'Rekruttering',
        beOmTilgangBeskrivelse: `
            Gå til Arbeidsplassen for å rekruttere og lage stillingsannonser.
            Under «Kandidater til dine stillinger» kan du se CV til personer NAV har sendt deg.
        `,
        tjenestekode: '5078',
        tjenesteversjon: '1',
    },

    tilskuddsbrev: {
        sort: 'tjeneste',
        navn: 'Tilskuddsbrev om NAV-tiltak',
        beOmTilgangBeskrivelse: `
            Få tilgang til digitale tilskuddsbrev om NAV-tiltak i Altinn.
            NAV sender digitale brev om blant annet inkluderingstilskudd og
            tilskudd til mentor og ekspertbistand.
        `,
        tjenestekode: '5278',
        tjenesteversjon: '1',
    },
    yrkesskade: {
        sort: 'tjeneste',
        navn: 'Meld inn yrkesskade eller yrkessykdom',
        beOmTilgangTittel: 'Meld inn yrkesskade',
        beOmTilgangBeskrivelse:
            'Få mulighet til å melde inn yrkesskade eller yrkessykdom digitalt.',
        tjenestekode: '5902',
        tjenesteversjon: '1',
    },
};

export const altinntjeneste: Record<AltinntjenesteId, Altinn> = {
    ...altinnskjema,
    ...navtjenester,
};
