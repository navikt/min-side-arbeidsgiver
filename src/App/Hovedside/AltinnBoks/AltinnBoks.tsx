import React, { Component, FunctionComponent } from "react";
import "./AltinnBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";

class AltinnBoks extends Component {
  render() {
    return (
      <div className={"AlltinnBoks"}>
        <Undertittel>{"Digitale skjema på Altinn"}</Undertittel>
        <Lenke
          href={
            "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-inkluderingstilskudd/"
          }
        >
          {"Søk om inkluderingstilskudd"}
        </Lenke>
        <Lenke
          href={
            "https://altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/avtale-om-oppstart-av-lonnstilskudd/"
          }
        >
          {"Søk om lønnstilskudd"}
        </Lenke>
        <Lenke
          href={
            "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/soknad-om-tilskudd-til-mentor/"
          }
        >
          {"Søk om tilskudd til mentor"}
        </Lenke>
        <Lenke
          href={
            "https://www.altinn.no/skjemaoversikt/arbeids--og-velferdsetaten-nav/Inntektsmelding-til-NAV/"
          }
        >
          {"Inntektsmelding til NAV"}
        </Lenke>
        <Undertittel>{"Velg søknadsskjema (PDF)"}</Undertittel>
        <Normaltekst>
          {"Oversikt over skjemaer og søknader for arbeidsgivere"}
        </Normaltekst>

        <Lenke
          href={"https://www.nav.no/no/bedrift/skjemaer-for-arbeidsgivere"}
        >
          {"Gå til skjemaer og søknader for arbeidsgivere"}
        </Lenke>
      </div>
    );
  }
}

export default AltinnBoks;
