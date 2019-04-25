import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import Pamboks from "./Pamboks/Pamboks";
import Syfoboks from "./Syfoboks/Syfoboks";
import {
  OrganisasjonsDetaljerContext,
  TilgangPam
} from "../../OrganisasjonDetaljerProvider";
import { SyfoTilgangContext, TilgangSyfo } from "../../SyfoTilgangProvider";
import Bedriftsinfoknapp from "./Bedriftsinfoknapp/Bedriftsinfoknapp";

const Hovedside: FunctionComponent = () => {
  const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
  const riktigRolleAltinn = true;
  const { tilgangTilPamState } = useContext(OrganisasjonsDetaljerContext);

  return (
    <div className="forside">
      {tilgangTilPamState !== TilgangPam.LASTER &&
        tilgangTilSyfoState !== TilgangSyfo.LASTER && (
          <div className={"forside__tjenestebokser"}>
            {tilgangTilSyfoState === TilgangSyfo.TILGANG && <Syfoboks />}
            {tilgangTilPamState === TilgangPam.TILGANG && <Pamboks />}
            <ArbeidsgiverTelefon />
            <KontaktOss />
            <AltinnBoks riktigRolle={riktigRolleAltinn} />
            <Bedriftsinfoknapp />
          </div>
        )}
    </div>
  );
};

export default Hovedside;
