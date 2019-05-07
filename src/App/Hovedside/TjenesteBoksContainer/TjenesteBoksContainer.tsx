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
    console.log("useeffect for tjenestebokscontainer");
    const antallTjenesteTilganger = tellAntallTilganger();
    if (antallTjenesteTilganger % 2 === 0) {
      settypeAntall("antall-partall");
      console.log("setTypetall: ", typeAntall);
    } else if (antallTjenesteTilganger == 1) {
      settypeAntall("antall-en");
      console.log("setTypetall: ", typeAntall);
    } else {
      settypeAntall("antall-oddetall");
      console.log("setTypetall: ", typeAntall);
    }
  }, [tilgangTilSyfoState, tilgangTilPamState]);

  return (
    <div className={"tjenesteboks-container " + typeAntall}>
      {tilgangTilPamState !== TilgangPam.LASTER &&
        tilgangTilSyfoState !== TilgangSyfo.LASTER && (
          <div className={"tjenesteboks-container " + typeAntall}>
            {tilgangTilSyfoState === TilgangSyfo.TILGANG && (
              <Innholdsboks className={"tjenesteboks innholdsboks"}>
                <Syfoboks className={"syfoboks"} />
              </Innholdsboks>
            )}
            {tilgangTilPamState === TilgangPam.TILGANG && (
              <div className={"tjenesteboks innholdsboks"}>
                <Pamboks />
              </div>
            )}
          </div>
        )}
    </div>
  );
};

export default TjenesteBoksContainer;
