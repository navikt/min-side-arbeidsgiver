import React, { Component, FunctionComponent } from "react";
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

class AltinnBoks extends Component {
  render() {
    return (
      <div className={"alltinnBoks"}>
        <Undertittel>Digitale skjema på Altinn</Undertittel>
        <Lenke href={soknadskjemaInkluderingstilskudd}>
          {"Søk om inkluderingstilskudd"}
        </Lenke>
        <Lenke href={soknadsskjemaLonnstilskudd}>
          {"Søk om lønnstilskudd"}
        </Lenke>
        <Lenke href={soknadTilskuddTilMentor}>
          {"Søk om tilskudd til mentor"}
        </Lenke>
        <Lenke href={inntekstmelding}>{"Inntektsmelding til NAV"}</Lenke>
        <Undertittel>Velg søknadsskjema (PDF)</Undertittel>
        <Normaltekst>
          Oversikt over skjemaer og søknader for arbeidsgivere
        </Normaltekst>
        <Lenke href={skjemaForArbeidsgivere}>
          {"Gå til skjemaer og søknader for arbeidsgivere"}
        </Lenke>
      </div>
    );
  }
}

export default AltinnBoks;
