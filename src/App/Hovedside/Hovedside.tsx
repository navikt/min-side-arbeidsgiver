import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import Pamboks from "./TjenesteBoks/Pamboks";
import Syfoboks from "./TjenesteBoks/Syfoboks";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";

const Hovedside: FunctionComponent = () => {
  const tilgangTilSyfo = false;
  const riktigRolleAltinn = true;
  const { tilgangTilPam } = useContext(OrganisasjonsDetaljerContext);

  return (
    <div className="forside">
      <div className={"forside__tjenestebokser"}>
        {tilgangTilSyfo && <Syfoboks />}
        {tilgangTilPam && <Pamboks />}
        <ArbeidsgiverTelefon />
        <KontaktOss />
        <AltinnBoks riktigRolle={riktigRolleAltinn} />
      </div>
    </div>
  );
};

export default Hovedside;
