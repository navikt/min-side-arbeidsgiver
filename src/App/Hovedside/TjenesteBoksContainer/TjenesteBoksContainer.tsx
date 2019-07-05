import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import { SyfoTilgangContext, TilgangSyfo } from "../../../SyfoTilgangProvider";
import {
  OrganisasjonsDetaljerContext,
  TilgangPam
} from "../../../OrganisasjonDetaljerProvider";
import "./TjenesteBoksContainer.less";

import Syfoboks from "./Syfoboks/Syfoboks";
import Pamboks from "./Pamboks/Pamboks";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import Arbeidstreningboks from "./Arbeidstreningboks/Arbeidstreningboks";

const TjenesteBoksContainer: FunctionComponent = () => {
  const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
  const { tilgangTilPamState } = useContext(OrganisasjonsDetaljerContext);
  const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
  const [typeAntall, settypeAntall] = useState("");

  useEffect(() => {
    const tellAntallTilganger = (): number => {
      let antallTilganger: number = 0;
      if (tilgangTilPamState === TilgangPam.TILGANG) {
        antallTilganger++;
      }
      if (tilgangTilSyfoState === TilgangSyfo.TILGANG) {
        antallTilganger++;
      }
      if (arbeidsavtaler.length) {
        antallTilganger++;
      }

      return antallTilganger;
    };

    let antallTjenesteTilganger = tellAntallTilganger();
    if (antallTjenesteTilganger % 2 === 0) {
      settypeAntall("antall-partall");
    } else if (antallTjenesteTilganger === 1) {
      settypeAntall("antall-en");
    } else {
      settypeAntall("antall-oddetall");
    }
  }, [tilgangTilSyfoState, tilgangTilPamState, arbeidsavtaler]);

  return (
    <div className={"tjenesteboks-container " + typeAntall}>
      {tilgangTilSyfoState !== TilgangSyfo.LASTER &&
        tilgangTilSyfoState === TilgangSyfo.TILGANG && (
          <Innholdsboks className={"tjenesteboks innholdsboks"}>
            <Syfoboks className={"syfoboks"} />
          </Innholdsboks>
        )}
      {tilgangTilPamState !== TilgangPam.LASTER &&
        tilgangTilPamState === TilgangPam.TILGANG && (
          <div className={"tjenesteboks innholdsboks"}>
            <Pamboks />
          </div>
        )}
      {arbeidsavtaler.length > 0 && (
        <div className={"tjenesteboks innholdsboks"}>
          <Arbeidstreningboks />
        </div>
      )}
    </div>
  );
};

export default TjenesteBoksContainer;
