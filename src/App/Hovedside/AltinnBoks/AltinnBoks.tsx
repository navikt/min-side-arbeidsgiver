import React, { FunctionComponent } from "react";
import "./AltinnBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import {
  inntekstmelding,
  skjemaForArbeidsgivere,
  soknadskjemaInkluderingstilskudd,
  soknadsskjemaLonnstilskudd,
  soknadTilskuddTilMentor
} from "../../../lenker";
import Innholdsboks from "../Innholdsboks/Innholdsboks";

const AltinnBoks: FunctionComponent = () => {
  return (
    <Innholdsboks className={"altinnBoks"}>
      <Undertittel>Digitale skjema på Altinn</Undertittel>
      <Lenke href={soknadskjemaInkluderingstilskudd} target={"_blank"}>
        Søk om inkluderingstilskudd
      </Lenke>
      <Lenke href={soknadsskjemaLonnstilskudd} target={"_blank"}>
        Søk om lønnstilskudd
      </Lenke>
      <Lenke href={soknadTilskuddTilMentor} target={"_blank"}>
        Søk om tilskudd til mentor
      </Lenke>
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

export default AltinnBoks;
