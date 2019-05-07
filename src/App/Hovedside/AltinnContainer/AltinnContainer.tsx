import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import {
  OrganisasjonsDetaljerContext,
  TilgangAltinn
} from "../../../OrganisasjonDetaljerProvider";

import "./AltinnContainer.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { Ingress } from "nav-frontend-typografi";
import nyfane from "./AltinnLenke/external-link.svg";

import {
  inntekstmelding,
  soknadskjemaInkluderingstilskudd,
  soknadsskjemaLonnstilskudd,
  soknadTilskuddTilMentor
} from "../../../lenker";
import AltinnLenke from "./AltinnLenke/AltinnLenke";

const AltinnContainer: FunctionComponent = () => {
  const [typeAntall, settypeAntall] = useState("");
  const {
    tilgangTilAltinnForInntektsmelding,
    tilgangTilAltinnForTreSkjemaState
  } = useContext(OrganisasjonsDetaljerContext);

  useEffect(() => {
    if (
      tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG
    ) {
      settypeAntall("antall-skjema-partall");
    }
    if (
      tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangAltinn.IKKE_TILGANG
    ) {
      settypeAntall("antall-skjema-en");
    }
    if (
      tilgangTilAltinnForInntektsmelding === TilgangAltinn.IKKE_TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG
    ) {
      settypeAntall("antall-skjema-en");
    }
  }, [tilgangTilAltinnForTreSkjemaState, tilgangTilAltinnForInntektsmelding]);

  return (
    <div className={"altinn-container"}>
      <Ingress className={"altinn-container__tekst"}>Skjema på Altinn</Ingress>
      <div className={"altinn-container__bokser"}>
        {tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG && (
          <AltinnLenke
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={soknadskjemaInkluderingstilskudd()}
            tekst={"Søk om inkluderingstilskudd"}
          />
        )}
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
      </div>
    </div>
  );
};

export default AltinnContainer;
