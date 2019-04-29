import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import Syfoboks from "../Syfoboks/Syfoboks";

import { SyfoTilgangContext, TilgangSyfo } from "../../../SyfoTilgangProvider";
import {
  OrganisasjonsDetaljerContext,
  TilgangPam
} from "../../../OrganisasjonDetaljerProvider";
import "./TjenesteBoksContainer.less";
import Pamboks from "../Pamboks/Pamboks";

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
    const antallTjenesteTilganger = tellAntallTilganger();
    if (antallTjenesteTilganger % 2 === 0) {
      settypeAntall("partall");
    } else if (antallTjenesteTilganger === 1) {
      settypeAntall("en");
    } else {
      settypeAntall("oddetall");
    }
  }, [TilgangSyfo, TilgangPam]);

  return (
    <div className="tjenesteboks-container abc">
      {tilgangTilPamState !== TilgangPam.LASTER &&
        tilgangTilSyfoState !== TilgangSyfo.LASTER && (
          <div className={"tjenesteboks-container " + typeAntall}>
            {tilgangTilSyfoState === TilgangSyfo.TILGANG && (
              <Syfoboks className={"tjenesteboks"} />
            )}
            {tilgangTilPamState === TilgangPam.TILGANG && (
              <Pamboks className={"tjenesteboks"} />
            )}
          </div>
        )}
    </div>
  );
};

export default TjenesteBoksContainer;
