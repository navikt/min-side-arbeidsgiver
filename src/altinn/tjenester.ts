import { gittMiljo } from '../utils/environment';
import * as Record from '../utils/Record';

export type AltinnskjemaId =
    | 'ekspertbistand'
    | 'inntektsmelding'
    | 'utsendtArbeidstakerEØS'
    | 'endreBankkontonummerForRefusjoner';

export const NAVtjenesteId = [
    'arbeidstrening',
    'arbeidsforhold',
    'midlertidigLønnstilskudd',
    'varigLønnstilskudd',
    'varigTilrettelagtArbeid',
    'sommerjobb',
    'mentortilskudd',
    'inkluderingstilskudd',
    'sykefravarstatistikk',
    'rekruttering',
    'tilskuddsbrev',
    'yrkesskade',
];
export type NAVtjenesteId = (typeof NAVtjenesteId)[number];

export type AltinnFellesInfo = {
    navn: string;
    beOmTilgangTittel?: string;
    beOmTilgangBeskrivelse: string /* Fravær av beskrivelse betyr man ikke kan søke om tilgang */;
};
export type Altinn2Tilgang = {
    tjenestekode: string;
    tjenesteversjon: string;
};

export type Altinn3Tilgang = {
    ressurs: string;
};

export function isAltinn2Tilgang(altinn: Altinn): boolean {
    return 'tjenestekode' in altinn && 'tjenesteversjon' in altinn;
}

export function isAltinn3Tilgang(altinn: Altinn): boolean {
    return 'ressurs' in altinn;
}

export type Altinnskjema = AltinnFellesInfo &
    (Altinn2Tilgang | Altinn3Tilgang) & {
        sort: 'skjema';
        skjemaUrl: string;
    };

export type NAVTjeneste = AltinnFellesInfo &
    (Altinn2Tilgang | Altinn3Tilgang) & {
        sort: 'tjeneste';
    };

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
        beOmTilgangBeskrivelse: '',
        skjemaUrl:
            'https://info.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/bankkontonummer-for-refusjoner-fra-nav-til-arbeidsgiver/',
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
    varigTilrettelagtArbeid: {
        sort: 'tjeneste',
        navn: 'Varig tilrettelagt arbeid',
        tjenestekode: '5516',
        tjenesteversjon: '6',
        beOmTilgangBeskrivelse: `
        Få tilgang til avtaler om varig tilrettelagt arbeid i ordinær virksomhet.
        Du kan søke om tilskudd for å dekke merkostnader du som
        arbeidsgiver har ved tilrettelegging av arbeidsplassen.`,
    },
    sykefravarstatistikk: {
        sort: 'tjeneste',
        navn: 'Sykefraværsstatistikk',
        beOmTilgangBeskrivelse: `Du må ha enkeltrettigheten «Virksomhetens legemeldte sykefraværsstatistikk» for å ta i bruk tjenesten. Spør virksomheten din hvem som kan gi deg rettigheter i Altinn.`,
        ressurs: 'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk',
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
    rekruttering_stillingsannonser: {
        sort: 'tjeneste',
        navn: 'Stillingsannonser',
        beOmTilgangBeskrivelse: `Du må ha enkeltrettigheten «Stillingsannonser på arbeidsplassen.no» for å ta i bruk tjenesten. Spør virksomheten din hvem som kan gi deg rettigheter i Altinn.`,
        ressurs: 'nav_rekruttering_stillingsannonser',
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
