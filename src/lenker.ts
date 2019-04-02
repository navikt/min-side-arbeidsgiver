export const soknadskjemaInkluderingstilskudd =
  process.env.INKLUDERINGSTILSKUDD_URL ||
  "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5212";
export const soknadsskjemaLonnstilskudd =
  process.env.LONNSTILSKUDD_URL ||
  "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5159";
export const soknadTilskuddTilMentor =
  process.env.TILSKUDDMENTOR_URL ||
  "https://tt02.altinn.no/Pages/ServiceEngine/Start/StartService.aspx?ServiceEditionCode=1&ServiceCode=5216";
export const inntekstmelding =
  process.env.INNTEKTSMELDING_URL ||
  "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/";
export const skjemaForArbeidsgivere =
  "https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere";
export const syfoLink =
  process.env.SYFO_URL || "https://tjenester-q0.nav.no/sykefravaerarbeidsgiver";
export const pamLink =
  process.env.PAM_URL || "https://arbeidsplassen-q.nav.no/";
export const pamApiLink = (orgnr: string) => {
  return `/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
};
export const pamHentStillingsannonser =
  "/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/stillinger/numberByStatus";
