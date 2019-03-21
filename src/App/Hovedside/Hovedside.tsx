import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext
} from "react";
import sykeIkon from "./iconSykemeldte.svg";
import rekrutteringsIkon from "./iconRekruttering.svg";
import "./Hovedside.less";
import TjenesteBoks from "./TjenesteBoks/TjenesteBoks";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import KontaktOss from "./KontaktOss/KontaktOss";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import { pamLink, syfoLink } from "../../lenker";
import { sjekkPamTilgang } from "../../api/pamApi";
import { OrganisasjonContext } from "../../OrganisasjonProvider";

const Hovedside: FunctionComponent = () => {
  const [tilgangTilPam, setTilgangTilPam] = useState(false);
  const { valgtOrganisasjon } = useContext(OrganisasjonContext);

  useEffect(() => {
    const hentPamTilgang = async () => {
      if (valgtOrganisasjon) {
        let tilgangPam = await sjekkPamTilgang(
          valgtOrganisasjon.OrganizationNumber
        );
        setTilgangTilPam(tilgangPam);
      }
    };
    hentPamTilgang();
  }, [valgtOrganisasjon]);

  return (
    <div className="forside">
      <div className={"forside__tjenestebokser"}>
        <TjenesteBoks
          tittel={"Dine sykemeldte"}
          undertekst={
            "Hold oversikten over sykemeldingene for de ansatte som du følger opp."
          }
          bildeurl={sykeIkon}
          lenketekst={"Gå til dine sykemeldte"}
          lenke={syfoLink}
        />
        {tilgangTilPam && (
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
        <AltinnBoks> </AltinnBoks>
        <div className={"forside__tlfogKontakt"}>
          <ArbeidsgiverTelefon />
          <KontaktOss />
        </div>
      </div>
    </div>
  );
};

export default Hovedside;
