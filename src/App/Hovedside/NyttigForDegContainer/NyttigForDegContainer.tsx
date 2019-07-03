import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import Bedriftsinfoknapp from "./Bedriftsinfoknapp/Bedriftsinfoknapp";
import "./NyttigForDegContainer.less";
import KontaktOss from "./KontaktOss/KontaktOss";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import { Ingress } from "nav-frontend-typografi";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
import { TilgangPam } from "../../../OrganisasjonDetaljerProvider";
import { TilgangSyfo } from "../../../SyfoTilgangProvider";
import { pamSettBedriftLenke } from "../../../lenker";

const NyttigForDegContainer: FunctionComponent = () => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const [antallBokser, setAntallBokser] = useState("to");

  useEffect(() => {
    if (organisasjoner.length < 0) {
      setAntallBokser("tre");
    }
  }, [organisasjoner]);

  return (
    <div className={"nyttig-for-deg"}>
      <Ingress className={"nyttig-for-deg__tekst"}>Nyttig for deg</Ingress>
      <div className={"nyttig-for-deg__bokser " + antallBokser}>
        {organisasjoner.length < 0 && (
          <div className={"nyttig-for-deg-innholdsboks"}>
            <Bedriftsinfoknapp />
          </div>
        )}
        <div className={"nyttig-for-deg-innholdsboks"}>
          <KontaktOss />
        </div>
        <div className={"nyttig-for-deg-innholdsboks"}>
          <ArbeidsgiverTelefon />
        </div>
      </div>
    </div>
  );
};

export default NyttigForDegContainer;
