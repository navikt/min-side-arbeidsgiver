import * as Record from '../utils/Record';

export type AltinnskjemaId = 'utsendtArbeidstakerEØS';

export type NAVtjenesteId =
    | 'arbeidstrening'
    | 'arbeidsforhold'
    | 'ekspertbistand'
    | 'endreBankkontonummerForRefusjoner'
    | 'inntektsmelding'
    | 'inntektsmeldingForeldrepenger'
    | 'inntektsmeldingSykepenger'
    | 'inntektsmeldingSykdomIFamilien'
    | 'refusjonskravSykepengerAGP'
    | 'midlertidigLønnstilskudd'
    | 'varigLønnstilskudd'
    | 'varigTilrettelagtArbeid'
    | 'sommerjobb'
    | 'mentortilskudd'
    | 'inkluderingstilskudd'
    | 'firearigLønnstilskudd'
    | 'tilskuddsbrev'
    | 'tiltaksrefusjon'
    | 'sykefravarstatistikk'
    | 'rekrutteringKandidater'
    | 'rekrutteringStillingsannonser'
    | 'yrkesskade'
    | 'permitteringOgNedbemanning'
    | 'oppgiNarmesteleder';

export type AltinnFellesInfo = {
    navn: string;
    beOmTilgangTittel?: string;
    beOmTilgangBeskrivelse: string;
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
        ressurs: 'nav_tiltak_arbeidstrening',
    },
    arbeidsforhold: {
        sort: 'tjeneste',
        navn: 'Arbeidsforhold',
        beOmTilgangBeskrivelse: `
            Få oversikt over alle arbeidsforhold du som arbeidsgiver har
            rapportert inn via A-meldingen. Her kan du kontrollere opplysningene
            og se hva som er registrert i arbeidsgiver- og arbeidstakerregisteret
            (Aa-registeret).`,
        ressurs: 'nav_arbeidsforhold_aa-registeret-innsyn-arbeidsgiver',
    },
    ekspertbistand: {
        sort: 'tjeneste',
        navn: 'Ekspertbistand',
        beOmTilgangBeskrivelse: `Tilskudd til ekspertbistand kan gis til arbeidsgivere for å forebygge lange eller hyppig gjentakende sykefravær i enkeltsaker.`,
        ressurs: 'nav_tiltak_ekspertbistand',
    },
    endreBankkontonummerForRefusjoner: {
        sort: 'tjeneste',
        navn: 'Registrere kontonummer for utbetalinger fra Nav til arbeidsgiver',
        beOmTilgangBeskrivelse: '', // skjult fra be om tilgang
        ressurs: 'nav_utbetaling_endre-kontonummer-refusjon-arbeidsgiver',
    },
    inntektsmelding: {
        sort: 'tjeneste',
        navn: 'Inntektsmelding',
        beOmTilgangBeskrivelse: ``, // skjult fra be om tilgang, kun for gamle tilganger i overgangsperioden
        tjenestekode: '4936',
        tjenesteversjon: '1',
    },
    inntektsmeldingForeldrepenger: {
        sort: 'tjeneste',
        navn: 'Inntektsmelding for foreldrepenger',
        beOmTilgangBeskrivelse: `Få tilgang til å sende inn og endre inntektsmeldinger for foreldrepenger og svangerskapspenger, og lese relaterte Dialogporten meldinger sendt fra Nav.`,
        ressurs: 'nav_foreldrepenger_inntektsmelding',
    },
    inntektsmeldingSykepenger: {
        sort: 'tjeneste',
        navn: 'Inntektsmelding for sykepenger',
        beOmTilgangBeskrivelse: `Få tilgang til å sende opplysninger til NAV om inntekt, arbeidsgiverperiode, eventuelle naturalytelser og om arbeidsgiver krever refusjon av utbetalt lønn under sykefravær.`,
        ressurs: 'nav_sykepenger_inntektsmelding',
    },
    inntektsmeldingSykdomIFamilien: {
        sort: 'tjeneste',
        navn: 'Inntektsmelding for pleie-, opplærings- og omsorgspenger og refusjonskrav for omsorgspenger',
        beOmTilgangBeskrivelse: `Få tilgang til å sende inn og endre inntektsmeldinger og refusjonskrav for pleie-, opplærings- og omsorgspenger, og lese relaterte Dialogporten meldinger sendt fra Nav.`,
        ressurs: 'nav_sykdom-i-familien_inntektsmelding',
    },
    refusjonskravSykepengerAGP: {
        sort: 'tjeneste',
        navn: 'Refusjonskrav for sykepenger i arbeidsgiverperioden',
        beOmTilgangBeskrivelse: `Få tilgang til å søke om dekning av arbeidsgiverperioden når en arbeidstaker er kronisk syk eller er sykmeldt grunnet graviditet.`,
        ressurs: 'nav_sykepenger_fritak-arbeidsgiverperiode',
    },
    midlertidigLønnstilskudd: {
        sort: 'tjeneste',
        navn: 'Midlertidig lønnstilskudd',
        beOmTilgangBeskrivelse: `
            Få tilgang til avtaler om midlertidig lønnstilskudd i din virksomhet.
            Lønnstilskudd kan gis dersom du ansetter personer som har problemer
            med å komme inn på arbeidsmarkedet.`,
        ressurs: 'nav_tiltak_midlertidig-lonnstilskudd',
    },
    varigLønnstilskudd: {
        sort: 'tjeneste',
        navn: 'Varig lønnstilskudd',
        beOmTilgangBeskrivelse: `
                Få tilgang til avtaler om varig lønnstilskudd i din virksomhet.
                Lønnstilskudd kan gis dersom du ansetter personer som har problemer
                med å komme inn på arbeidsmarkedet.`,
        ressurs: 'nav_tiltak_varig-lonnstilskudd',
    },
    sommerjobb: {
        sort: 'tjeneste',
        navn: 'Sommerjobb',
        beOmTilgangBeskrivelse: `
                Få tilgang til avtaler om sommerjobb i din virksomhet.
                Tilskudd til sommerjobb kan gis dersom du kan tilby sommerjobb til unge arbeidsledige som har fått vurdert av NAV at de har behov for arbeidsrettet bistand.`,
        ressurs: 'nav_tiltak_sommerjobb',
    },
    mentortilskudd: {
        sort: 'tjeneste',
        navn: 'Mentortilskudd',
        beOmTilgangBeskrivelse: `
            Få tilgang til avtaler om mentortilskudd. 
            Du kan søke om mentortilskudd for å få dekket frikjøp av en 
            arbeidskollega som kan gi praktisk hjelp, veiledning og opplæring 
            for personer som gjennomfører arbeidsmarkedstiltak.
            `,
        ressurs: 'nav_tiltak_mentor',
    },
    inkluderingstilskudd: {
        sort: 'tjeneste',
        navn: 'Inkluderingstilskudd',
        beOmTilgangBeskrivelse: `
        Få tilgang til avtaler om inkluderingstilskudd.
        Du kan søke om tilskudd for å dekke merkostnader du som
        arbeidsgiver har ved tilrettelegging av arbeidsplassen.`,
        ressurs: 'nav_tiltak_inkluderingstilskudd',
    },
    varigTilrettelagtArbeid: {
        sort: 'tjeneste',
        navn: 'Varig tilrettelagt arbeid',
        beOmTilgangBeskrivelse: `
        Få tilgang til avtaler om varig tilrettelagt arbeid i ordinær virksomhet.
        Du kan søke om tilskudd for å dekke merkostnader du som
        arbeidsgiver har ved tilrettelegging av arbeidsplassen.`,
        ressurs: 'nav_tiltak_varig-tilrettelagt-arbeid-ordinaer',
    },
    firearigLønnstilskudd: {
        sort: 'tjeneste',
        navn: 'Fireårig lønnstilskudd for unge',
        beOmTilgangBeskrivelse: `Få tilgang til å endre avtaler om fireårig lønnstilskudd for unge, samt lese eksisterende avtaler som er gjeldende for virksomheten.`,
        ressurs: 'nav_tiltak_firearig-lonnstilskudd',
    },
    tiltaksrefusjon: {
        sort: 'tjeneste',
        navn: 'Tiltaksrefusjon',
        beOmTilgangBeskrivelse: `Få tilgang til å håndtere refusjon for lønnstilskudd, tilskudd til sommerjobb, mentortilskudd og varig tilrettelagt arbeid i ordinær virksomhet.`,
        ressurs: 'nav_tiltak_tiltaksrefusjon',
    },
    sykefravarstatistikk: {
        sort: 'tjeneste',
        navn: 'Sykefraværsstatistikk',
        beOmTilgangBeskrivelse: `Få innsyn i statistikk for virksomhetens legemeldte sykefravær (sykefraværsstatistikk), og sammenligning med statistikk for tilhørende næring.`,
        ressurs: 'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk',
    },
    rekrutteringKandidater: {
        sort: 'tjeneste',
        navn: 'Kandidater til dine stillinger',
        beOmTilgangBeskrivelse: `Få tilgang til oversendte CV-er fra Nav på nav.no, når de har innledet et samarbeid med Nav i et rekrutteringsoppdrag.`,
        ressurs: 'nav_rekruttering_kandidater',
    },
    rekrutteringStillingsannonser: {
        sort: 'tjeneste',
        navn: 'Stillingsannonser på arbeidsplassen.no',
        beOmTilgangBeskrivelse: `Få tilgang til å registrere og redigere stillingsannonser samt motta og behandle «superraske søknader» knyttet til stillingsannonsen.`,
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
        ressurs: 'nav_tiltak_tilskuddsbrev',
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
    oppgiNarmesteleder: {
        sort: 'tjeneste',
        navn: 'Oppgi nærmeste leder',
        beOmTilgangBeskrivelse: `Få tilgang til å endre hvem som er nærmeste leder for en sykmeldt ansatt i bedriften.`,
        ressurs: 'nav_syfo_oppgi-narmesteleder',
    },
    permitteringOgNedbemanning: {
        sort: 'tjeneste',
        navn: 'Skjema til NAV om permitteringer, oppsigelser, eller innskrenkning i arbeidstid',
        beOmTilgangBeskrivelse: `Få tilgang til å opprette og se innsendte meldinger til Nav om permitteringer, oppsigelser, eller innskrenkning i arbeidstid.`,
        ressurs: 'nav_permittering-og-nedbemmaning_innsyn-i-alle-innsendte-meldinger',
    },
};

export const altinntjeneste: Record<AltinntjenesteId, Altinn> = {
    ...altinnskjema,
    ...navtjenester,
};
