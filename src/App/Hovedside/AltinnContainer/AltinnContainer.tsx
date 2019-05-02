import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import "./AltinnContainer.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { Ingress } from "nav-frontend-typografi";

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
            className={"altinn-container__" + typeAntall}
            href={soknadskjemaInkluderingstilskudd()}
            tittelProps={"element"}
            border={false}
          >
            Søk om inkluderingstilskudd
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
          </Lenkepanel>
        )}
      </div>
    </div>
  );
};

export default AltinnContainer;
