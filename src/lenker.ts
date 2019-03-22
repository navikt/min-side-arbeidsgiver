export const soknadskjemaInkluderingstilskudd =
  "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-inkluderingstilskudd/";
export const soknadsskjemaLonnstilskudd =
  "https://altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/avtale-om-oppstart-av-lonnstilskudd/";
export const soknadTilskuddTilMentor =
  "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-mentor/";
export const inntekstmelding =
  "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/";
export const skjemaForArbeidsgivere =
  "https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere";
export const syfoLink = "https://tjenester.nav.no/sykefravaerarbeidsgiver";
export const pamLink = "https://arbeidsplassen.nav.no/";
export const pamApiLink = (orgnr: string) => {
  //https://arbeidsplassen-q.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}
  return `/pam/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`;
};
export const linkTilPamHardkodetBedrift =
  "/pam/stillingsregistrering-api/api/arbeidsgiver/811076422";
export const MockKallLinkTilPam =
  "begin:/pam/stillingsregistrering-api/api/arbeidsgiver/";
