import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import "./Pamboks.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";
import Innholdsboks from "../../Innholdsboks/Innholdsboks";
import { pamRekruttering, pamStillingsannonser } from "../../../../lenker";
import pamikon from "./pamikon.svg";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";

interface Props {
  className: string;
}

const Pamboks: FunctionComponent<Props> = props => {
  const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
  const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState(
    "Lag ny stillingsannonse"
  );

  useEffect(() => {
    if (antallAnnonser > 0) {
      setStillingsAnnonseTekst(
        "Stillingsannonser (" + antallAnnonser + " aktive)"
      );
    }
  });

  return (
    <div className={"pamboks " + props.className}>
      <TjenesteBoksBanner tittel={"Rekruttering"} imgsource={pamikon} />
      <Lenkepanel
        className={"__stillingsannonser"}
        href={pamStillingsannonser()}
        tittelProps={"element"}
        border={false}
      >
        {stillingsAnnonseTekst}
      </Lenkepanel>
      <Lenkepanel
        className={"__rekruttering"}
        href={pamRekruttering()}
        tittelProps={"element"}
        border={false}
      >
        Finn kandidater
      </Lenkepanel>
    </div>
  );
};

export default Pamboks;
