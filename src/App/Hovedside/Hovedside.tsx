import React, { FunctionComponent, useContext, useState } from "react";

import "./Hovedside.less";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import Pamboks from "./Pamboks/Pamboks";
import Syfoboks from "./Syfoboks/Syfoboks";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";

const Hovedside: FunctionComponent = () => {
  const tilgangTilSyfo = true;
  const riktigRolleAltinn = true;
  const { tilgangTilPam, antallAnnonser } = useContext(
    OrganisasjonsDetaljerContext
  );
  const [varselTekst, setVarselTekst] = useState("");

  React.useEffect(() => {
    const varselString = antallAnnonser.toString();
    if (antallAnnonser > 0) {
      setVarselTekst(varselString + " aktive annonser");
    }
  }, [antallAnnonser]);

  return (
    <div className="forside">
      <div className={"forside__tjenestebokser"}>
        {tilgangTilSyfo && <Syfoboks />}
        {tilgangTilPam && <Pamboks varseltekst={varselTekst} />}
        <ArbeidsgiverTelefon />
        <KontaktOss />
        <AltinnBoks riktigRolle={riktigRolleAltinn} />
      </div>
    </div>
  );
};

export default Hovedside;
