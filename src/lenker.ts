export const soknadskjemaInkluderingstilskudd =
  process.env.INKLUDERINGSTILSKUDD_URL || "";
export const soknadsskjemaLonnstilskudd = process.env.LONNSTILSKUDD_URL || "";
export const soknadTilskuddTilMentor = process.env.TILSKUDDMENTOR_URL || "";
export const inntekstmelding = process.env.INNTEKTSMELDING_URL || "";
export const skjemaForArbeidsgivere =
  "https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere";
export const syfoLink = process.env.SYFO_URL || "";
export const pamLink = process.env.PAM_URL || "";
export const pamApiLink = (orgnr: string) => {
  return `/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
};
export const pamHentStillingsannonser =
  "/ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/stillinger/numberByStatus";
