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
import rekrutteringsIkon from "./iconRekruttering.svg";
import { pamLink, syfoLink } from "../../lenker";
import TjenesteBoks from "./TjenesteBoks/TjenesteBoks";
import sykeIkon from "./iconSykemeldte.svg";
import Pamboks from "./TjenesteBoks/Pamboks";

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
          {tilgangTilSyfo && (
            <TjenesteBoks
              tittel={"Dine sykemeldte"}
              undertekst={
                "Hold oversikten over sykemeldingene for de ansatte som du følger opp."
              }
              bildeurl={sykeIkon}
              lenketekst={"Gå til dine sykemeldte"}
              lenke={syfoLink}
            />
          )}
          {!tilgangTilSyfo && tilgangTilPam && (
            <TjenesteBoks
              tittel={"Rekruttering"}
              undertekst={
                "Utlys stillinger, finn kandidater og se deres annonser."
              }
              bildeurl={rekrutteringsIkon}
              lenketekst={"Gå til rekruttering"}
              lenke={pamLink}
            />
          )}
          <AltinnBoks riktigRolle={riktigRolleAltinn} />
        </div>
        <div className={"andrekolonne"}>
          {tilgangTilPam && tilgangTilSyfo && (
            <TjenesteBoks
              tittel={"Rekruttering"}
              undertekst={
                "Utlys stillinger, finn kandidater og se deres annonser."
              }
              bildeurl={rekrutteringsIkon}
              lenketekst={"Gå til rekruttering"}
              lenke={pamLink}
            />
          )}
          <ArbeidsgiverTelefon />
          <KontaktOss />
        </div>
      </div>
    </div>
  );
};

export default Hovedside;
