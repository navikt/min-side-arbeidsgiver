export const soknadskjemaInkluderingstilskudd =
  process.env.INKLUDERINGSTILSKUDD_URL;
export const soknadsskjemaLonnstilskudd = process.env.LONNSTILSKUDD_URL;
export const soknadTilskuddTilMentor = process.env.TILSKUDDMENTOR_URL;
export const inntekstmelding = process.env.INNTEKTSMELDING_URL;
export const skjemaForArbeidsgivere =
  "https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere";
export const syfoLink = "https://tjenester.nav.no/sykefravaerarbeidsgiver";
export const pamLink = "https://arbeidsplassen.nav.no/";
export const pamApiLink = (orgnr: string) => {
  return `/pam/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
};
