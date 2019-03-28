import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext
} from "react";

import "./Hovedside.less";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import { hentPamTilgang } from "../../api/pamApi";
import { OrganisasjonContext } from "../../OrganisasjonProvider";
import Pamboks from "./TjenesteBoks/Pamboks";
import Syfoboks from "./TjenesteBoks/Syfoboks";

const Hovedside: FunctionComponent = () => {
  const [tilgangTilPam, setTilgangTilPam] = useState(false);
  const [tilgangTilSyfo, setTilgangTilSyfo] = useState(true);
  const [riktigRolleAltinn, setRiktigRolleAltinn] = useState(true);
  const { valgtOrganisasjon } = useContext(OrganisasjonContext);

  useEffect(() => {
    const sjekkPamTilgang = async () => {
      if (valgtOrganisasjon) {
        setTilgangTilPam(
          await hentPamTilgang(valgtOrganisasjon.OrganizationNumber)
        );
      }
    };
    sjekkPamTilgang();
  }, [valgtOrganisasjon]);

  return (
    <div className="forside">
      <div className={"forside__tjenestebokser"}>
        <div className={"forstekolonne"}>
          {tilgangTilSyfo && <Syfoboks />}
          <AltinnBoks riktigRolle={riktigRolleAltinn} />
        </div>
        <div className={"andrekolonne"}>
          {tilgangTilPam && <Pamboks />}
          <ArbeidsgiverTelefon />
          <KontaktOss />
        </div>
      </div>
    </div>
  );
};

export default Hovedside;
