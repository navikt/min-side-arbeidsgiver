import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext
} from "react";

import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";

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
  const { tilgangTilAltinnState } = useContext(OrganisasjonsDetaljerContext);
  let riktigRoll1 = false;
  let riktigRoll2 = true;

  useEffect(() => {
    console.log("tilgangAltinn: ", tilgangTilAltinnState);
    if (tilgangTilAltinnState) {
      settypeAntall("antall-skjema-partall");
      riktigRoll1 = true;
      riktigRoll2 = true;
    }
  }, [tilgangTilAltinnState]);

  return (
    <div className={"altinn-container"}>
      {tilgangTilAltinnState === 2 && (
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
            linkCreator={(props: any) => (
              <a target="_blank" {...props}>
                {props.children}
              </a>
            )}
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
            linkCreator={(props: any) => (
              <a target="_blank" {...props}>
                {props.children}
              </a>
            )}
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
            linkCreator={(props: any) => (
              <a target="_blank" {...props}>
                {props.children}
              </a>
            )}
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
            linkCreator={(props: any) => (
              <a target="_blank" {...props}>
                {props.children}
              </a>
            )}
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
