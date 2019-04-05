import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import Pamboks from "./TjenesteBoks/Pamboks";
import Syfoboks from "./TjenesteBoks/Syfoboks";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";

const Hovedside: FunctionComponent = () => {
  const { tilgangTilSyfo } = useContext(OrganisasjonsListeContext);
  const riktigRolleAltinn = true;
  const { tilgangTilPam } = useContext(OrganisasjonsDetaljerContext);

  return (
    <div className="forside">
      <div className={"forside__tjenestebokser"}>
        {tilgangTilSyfo && <Syfoboks />}
        {tilgangTilPam && <Pamboks />}
        <div className={"forside__tlf-kontakt"}>
          <ArbeidsgiverTelefon />
          <KontaktOss />
        </div>
        <AltinnBoks riktigRolle={riktigRolleAltinn} />
      </div>
    </div>
  );
};

export default Hovedside;
