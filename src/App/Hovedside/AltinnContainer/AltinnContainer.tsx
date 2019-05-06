import React, { FunctionComponent, useEffect, useState } from "react";

import "./AltinnContainer.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { Ingress } from "nav-frontend-typografi";
import nyfane from "./external-link.svg";

import {
  inntekstmelding,
  soknadskjemaInkluderingstilskudd,
  soknadsskjemaLonnstilskudd,
  soknadTilskuddTilMentor
} from "../../../lenker";

const AltinnContainer: FunctionComponent = () => {
  const [typeAntall, settypeAntall] = useState("");
  let riktigRoll1: boolean = true;
  let riktigRoll2: boolean = true;

  useEffect(() => {
    if (riktigRoll1 && riktigRoll2) {
      settypeAntall("antall-skjema-partall");
    }

    if (riktigRoll2 && !riktigRoll1) {
      settypeAntall("antall-skjema-en");
    }

    if (riktigRoll1 && !riktigRoll2) {
      settypeAntall("antall-skjema-tre");
    }
  });

  return (
    <div className={"altinn-container"}>
      {(riktigRoll1 || riktigRoll2) && (
        <Ingress className={"altinn-container__tekst"}>
          Skjema på Altinn
        </Ingress>
      )}
      <div className={"altinn-container__bokser"}>
        {riktigRoll1 && (
          <Lenkepanel
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={soknadskjemaInkluderingstilskudd()}
            tittelProps={"element"}
            border={false}
          >
            Søk om inkluderingstilskudd
            <img
              className={"altinn-container__ikon"}
              src={nyfane}
              alt="ikon for å beskrive at lenken åpnes i en ny fane"
            />
          </Lenkepanel>
        )}
        {riktigRoll1 && (
          <Lenkepanel
            className={"altinn-container__" + typeAntall}
            href={soknadsskjemaLonnstilskudd()}
            tittelProps={"element"}
            border={false}
          >
            Søk om lønnstilskudd
            <img
              className={"altinn-container__ikon"}
              src={nyfane}
              alt="ikon for å beskrive at lenken åpnes i en ny fane"
            />
          </Lenkepanel>
        )}
        {riktigRoll1 && (
          <Lenkepanel
            className={"altinn-container__" + typeAntall}
            href={soknadTilskuddTilMentor()}
            tittelProps={"element"}
            border={false}
          >
            Søk om tilskudd til mentor
            <img
              className={"altinn-container__ikon"}
              src={nyfane}
              alt="ikon for å beskrive at lenken åpnes i en ny fane"
            />
          </Lenkepanel>
        )}
        {riktigRoll2 && (
          <Lenkepanel
            className={"altinn-container__" + typeAntall}
            href={inntekstmelding}
            tittelProps={"element"}
            border={false}
          >
            Inntektsmelding til NAV
            <img
              className={"altinn-container__ikon"}
              src={nyfane}
              alt="ikon for å beskrive at lenken åpnes i en ny fane"
            />
          </Lenkepanel>
        )}
      </div>
    </div>
  );
};

export default AltinnContainer;
