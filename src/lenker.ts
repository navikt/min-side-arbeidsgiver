import environment from "./utils/environment";

export const soknadskjemaInkluderingstilskudd = () => {
  if (environment.MILJO === prod) {
    return "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-inkluderingstilskudd/";
  } else {
    return "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5212";
  }
};

export const soknadsskjemaLonnstilskudd = () => {
  if (environment.MILJO === prod) {
    return "https://altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/avtale-om-oppstart-av-lonnstilskudd/";
  } else {
    return "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5159";
  }
};

export const soknadTilskuddTilMentor = () => {
  if (environment.MILJO === prod) {
    return "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-mentor/";
  } else {
    return "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5216";
  }
};
export const inntekstmelding =
  "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/";

export const skjemaForArbeidsgivere =
  "https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere";
export const syfoLink = () => {
  if (environment.MILJO === prod) {
    return "https://tjenester.nav.no/sykefravaerarbeidsgive";
  } else {
    return "https://tjenester-q0.nav.no/sykefravaerarbeidsgiver";
  }
};
export const pamLink = () => {
  if (environment.MILJO === prod) {
    return "https://arbeidsplassen.nav.no/";
  } else {
    return "https://arbeidsplassen-q.nav.no/";
  }
};
export const pamApiLink = (orgnr: string) => {
  return `/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
};
export const pamHentStillingsannonser =
  "/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/stillinger/numberByStatus";
