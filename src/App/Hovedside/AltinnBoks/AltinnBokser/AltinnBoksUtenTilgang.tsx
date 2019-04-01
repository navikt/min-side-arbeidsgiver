import React, { FunctionComponent } from "react";
import "../AltinnBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import Innholdsboks from "../../Innholdsboks/Innholdsboks";
import { inntekstmelding, skjemaForArbeidsgivere } from "../../../../lenker";

const AltinnBoksUtenTilgang: FunctionComponent = () => {
  return (
    <Innholdsboks className={"altinnBoksUtenTilgang"}>
      <Undertittel>Inntekstsmelding på Altinn</Undertittel>
      <Lenke href={inntekstmelding} target={"_blank"}>
        Inntektsmelding til NAV
      </Lenke>
      <Undertittel>Velg søknadsskjema (PDF)</Undertittel>
      <Normaltekst>
        Oversikt over skjemaer og søknader for arbeidsgivere
      </Normaltekst>
      <Lenke href={skjemaForArbeidsgivere} target={"_blank"}>
        Gå til skjemaer og søknader for arbeidsgivere
      </Lenke>
    </Innholdsboks>
  );
};

export default AltinnBoksUtenTilgang;
