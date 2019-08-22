import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";

import "./AltinnContainer.less";
import { Undertittel } from "nav-frontend-typografi";

import {
  inntekstmelding,
  soknadskjemaInkluderingstilskudd,
  soknadsskjemaLonnstilskudd,
  soknadTilskuddTilMentor
} from "../../../lenker";
import AltinnLenke from "./AltinnLenke/AltinnLenke";
import { TilgangState } from "../../../SyfoTilgangProvider";

const AltinnContainer: FunctionComponent = () => {
  const [typeAntall, settypeAntall] = useState("");
  const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
  const {
    tilgangTilAltinnForInntektsmelding,
    tilgangTilAltinnForTreSkjemaState
  } = useContext(OrganisasjonsDetaljerContext);

  useEffect(() => {
    setgenerellAltinnTilgang(true);
    if (
      tilgangTilAltinnForInntektsmelding === TilgangState.TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangState.TILGANG
    ) {
      settypeAntall("antall-skjema-partall");
    } else if (
      tilgangTilAltinnForInntektsmelding === TilgangState.TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangState.IKKE_TILGANG
    ) {
      settypeAntall("antall-skjema-en");
    } else if (
      tilgangTilAltinnForInntektsmelding === TilgangState.IKKE_TILGANG &&
      tilgangTilAltinnForTreSkjemaState === TilgangState.TILGANG
    ) {
      settypeAntall("antall-skjema-tre");
    } else {
      setgenerellAltinnTilgang(false);
    }
  }, [tilgangTilAltinnForTreSkjemaState, tilgangTilAltinnForInntektsmelding]);

  return (
    <div className={"altinn-container"}>
      {generellAltinnTilgang && (
        <Undertittel className={"altinn-container__tekst"}>
          Skjema på Altinn
        </Undertittel>
      )}
      <div className={"altinn-container__bokser"}>
        {tilgangTilAltinnForTreSkjemaState === TilgangState.TILGANG && (
          <AltinnLenke
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={soknadskjemaInkluderingstilskudd()}
            tekst={"Søk om inkluderingstilskudd"}
          />
        )}
        {tilgangTilAltinnForTreSkjemaState === TilgangState.TILGANG && (
          <AltinnLenke
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={soknadsskjemaLonnstilskudd()}
            tekst={"Søk om lønnstilskudd"}
          />
        )}
        {tilgangTilAltinnForTreSkjemaState === TilgangState.TILGANG && (
          <AltinnLenke
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={soknadTilskuddTilMentor()}
            tekst={"Søk om tilskudd til mentor"}
          />
        )}

        {tilgangTilAltinnForInntektsmelding === TilgangState.TILGANG && (
          <AltinnLenke
            className={
              "altinn-container__" + typeAntall + " altinn-container__lenke"
            }
            href={inntekstmelding}
            tekst={"Inntektsmelding"}
          />
        )}
      </div>
    </div>
  );
};

export default AltinnContainer;
