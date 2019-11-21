import environment from './utils/environment';

export const soknadskjemaInkluderingstilskudd = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-inkluderingstilskudd/';
    } else {
        return 'https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5212';
    }
};

export const soknadsskjemaLonnstilskudd = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/avtale-om-oppstart-av-lonnstilskudd/';
    } else {
        return 'https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5159';
    }
};

export const soknadTilskuddTilMentor = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-mentor/';
    } else {
        return 'https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5216';
    }
};
export const inntekstmelding =
    'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/';

export const ekspertbistand =
    'https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-ekspertbistand/';

export const skjemaForArbeidsgivere = 'https://www.nav.no/soknader/nb/bedrift';

export const syfoLink = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://tjenester.nav.no/sykefravaerarbeidsgiver';
    } else {
        return 'https://tjenester-q1.nav.no/sykefravaerarbeidsgiver';
    }
};

export const veilarbStepup = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://tjenester.nav.no/veilarbstepup/oidc?url=https://arbeidsgiver.nav.no/min-side-arbeidsgiver/';
    } else {
        return 'https://tjenester-q1.nav.no/veilarbstepup/oidc?url=https://arbeidsgiver-q.nav.no/min-side-arbeidsgiver/';
    }
};

export const linkTilArbeidsplassen = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsplassen.nav.no/bedrift';
    } else {
        return 'https://arbeidsplassen-q.nav.no/bedrift';
    }
};

export const pamSettBedriftLenke = (orgnr: string) => {
    if (environment.MILJO === 'prod-sbs') {
        return `https://arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
    } else {
        return `https://arbeidsplassen-q.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
    }
};

export const pamHentStillingsannonserLenke = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus';
    } else {
        return 'https://arbeidsplassen-q.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus';
    }
};

export const digisyfoSykemeldteLenke = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/syforest/arbeidsgiver/sykmeldte';
    } else {
        return 'https://arbeidsgiver-q.nav.no/min-side-arbeidsgiver/syforest/arbeidsgiver/sykmeldte';
    }
};

export const digiSyfoNarmesteLederLink = '/min-side-arbeidsgiver/api/narmesteleder';

export const LenkeTilInfoOmRettigheterTilSykmelding =
    'https://www.nav.no/no/Bedrift/Oppfolging/Sykmeldt+arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/om-tilganger-i-altinn';
export const LenkeTilInfoOmAltinnRoller =
    'https://www.altinn.no/hjelp/profil/roller-og-rettigheter/';

export const hentUnderenhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;
};

export const hentOverordnetEnhetApiLink = (orgnr: string) => {
    return `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;
};

export const arbeidsAvtaleLink = () => {
    if (environment.MILJO === 'prod-sbs') {
        return 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/';
    } else {
        return 'https://arbeidsgiver-q.nav.no/tiltaksgjennomforing/';
    }
};

export const hentArbeidsavtalerApiLink = () => {
    return '/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler';
};

export const lenkeTilDittNavPerson='https://www.nav.no/person/dittnav/';
export const lenkeTilTilgangsstyringsInfo='https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring';

export const linkTilUnleash = '/min-side-arbeidsgiver/api/feature';

export const lenkeIAweb =
    'https://www.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=2&ServiceCode=3403&Oselect=true&M=SP';

export const lenkeTilInfoOmDigitaleSoknader =
    'https://www.nav.no/no/Bedrift/Tjenester+og+skjemaer/relatert-informasjon/s%C3%B8knader-om-arbeidsmarkedstiltak-og-tilskudd-fra-nav';

export const lenkeTilInforOmInntekstmelding =
    'https://www.nav.no/no/Bedrift/Tjenester+og+skjemaer/NAV-+og+Altinn-tjenester/inntektsmelding';
