import { gittMiljo } from '../utils/environment';
import * as Record from '../utils/Record';

export type AltinnskjemaId =
    | 'mentortilskudd'
    | 'inkluderingstilskudd'
    | 'ekspertbistand'
    | 'inntektsmelding';

export type NAVtjenesteId =
    | 'arbeidstrening'
    | 'arbeidsforhold'
    | 'midlertidigLønnstilskudd'
    | 'varigLønnstilskudd'
    | 'iaweb'
    | 'pam'
    | 'tilskuddsbrev';


export interface AltinnFellesInfo {
    navn: string;
    tjenestekode: string;
    tjenesteversjon: string;
    beOmTilgangBeskrivelse: string; /* Fravær av beskrivelse betyr man ikke kan søke om tilgang */
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
    mentortilskudd: {
        sort: 'skjema',
        navn: 'Mentortilskudd',
        tjenestekode: '5216',
        tjenesteversjon: '1',
        beOmTilgangBeskrivelse: `
            Få tilgang til å søke om mentortilskudd i Altinn. Du kan søke om
            mentortilskudd for å få dekket frikjøp av en arbeidskollega som
            kan gi praktisk hjelp, veiledning og opplæring for personer som gjennomfører
            arbeidsmarkedstiltak.`,
        skjemaUrl: gittMiljo({
            prod:
                'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-mentor/',
            other:
                'https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5216',
        }),
    },

    inkluderingstilskudd: {
        sort: 'skjema',
        navn: 'Inkluderingstilskudd',
        tjenestekode: '5212',
        tjenesteversjon: '1',
        beOmTilgangBeskrivelse: `
            Få tilgang til å søke om inkluderingstilskudd i Altinn.
            Du kan søke om tilskudd for å dekke merkostnader du som
            arbeidsgiver har ved tilrettelegging av arbeidsplassen.`,
        skjemaUrl: gittMiljo({
            prod:
                'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-inkluderingstilskudd/',
            other:
                'https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5212',
        }),
    },

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

    iaweb: {
        sort: 'tjeneste',
        navn: 'Sykfraværsstatistikk',
        beOmTilgangBeskrivelse: `Oversikt over sykefravær i din virksomhet og bransje.`,
        tjenestekode: '3403',
        tjenesteversjon: gittMiljo({ prod: '1', other: '2' }),
    },

    pam: {
        sort: 'tjeneste',
        navn: 'Rekruttering',
        beOmTilgangBeskrivelse: `
            Gå til Arbeidsplassen for å rekruttere og lage stillingsannonser.`,
        tjenestekode: '5078',
        tjenesteversjon: '1',
    },
    tilskuddsbrev: {
        sort: 'tjeneste',
        navn: 'Tilskuddsbrev om NAV-tiltak',
        beOmTilgangBeskrivelse: `
            Få tilgang til digitale tilskuddsbrev om NAV-tiltak i Altinn.
            NAV sender digitale brev om blant annet lønns- og inkluderingstilskudd og
            tilskudd til mentor og ekspertbistand.
        `,
        tjenestekode: '5278',
        tjenesteversjon: '1',
    }
};

export const altinntjeneste: Record<AltinntjenesteId, Altinn>
    = { ...altinnskjema, ...navtjenester}
