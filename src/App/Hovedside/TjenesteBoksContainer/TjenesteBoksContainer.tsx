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

const TjenesteBoksContainer: FunctionComponent = () => {
  const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
  const { tilgangTilPamState } = useContext(OrganisasjonsDetaljerContext);
  const [typeAntall, settypeAntall] = useState("");

  const tellAntallTilganger = (): number => {
    let antallTilganger: number = 0;
    if (tilgangTilPamState === TilgangPam.TILGANG) {
      antallTilganger++;
    }
    if (tilgangTilSyfoState === TilgangSyfo.TILGANG) {
      antallTilganger++;
    }

    return antallTilganger;
  };

  useEffect(() => {
    let antallTjenesteTilganger = tellAntallTilganger();
    if (antallTjenesteTilganger % 2 === 0) {
      settypeAntall("antall-partall");
    } else if (antallTjenesteTilganger === 1) {
      settypeAntall("antall-en");
    } else {
      settypeAntall("antall-oddetall");
    }
    settypeAntall("antall-partall");
  }, [TilgangSyfo, TilgangPam]);

  return (
    <div className={"tjenesteboks-container " + typeAntall}>
      {tilgangTilPamState !== TilgangPam.LASTER &&
        tilgangTilSyfoState !== TilgangSyfo.LASTER && (
          <div className={"tjenesteboks-container " + typeAntall}>
            {tilgangTilSyfoState === TilgangSyfo.TILGANG && (
              <div className={"tjenesteboks innholdsboks"}>
                <Syfoboks className={"syfobokstest"} />
              </div>
            )}
            {tilgangTilPamState === TilgangPam.TILGANG && (
              <div className={"tjenesteboks innholdsboks"}>
                <Pamboks className={"hei"} />
              </div>
            )}
            <div className={"tjenesteboks innholdsboks"}>
              <Pamboks className={"hei"} />
            </div>
            <div className={"tjenesteboks innholdsboks"}>
              <Pamboks className={"hei"} />
            </div>
          </div>
        )}
    </div>
  );
};

export default TjenesteBoksContainer;
