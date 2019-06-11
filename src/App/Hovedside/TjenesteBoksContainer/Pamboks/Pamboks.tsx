import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import "./Pamboks.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";
import { linkTilArbeidsplassen } from "../../../../lenker";
import pamikon from "./pamikon.svg";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";

interface Props {
  className?: string;
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
  }, [antallAnnonser]);

  return (
    <div className={"pamboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Rekruttering"}
        imgsource={pamikon}
        altTekst={"Forstørrelsesglass som fokuserer på jobbsøker"}
      />
      <Lenkepanel
        className={"pamboks__lenke"}
        href={linkTilArbeidsplassen()}
        tittelProps={"normaltekst"}
        border={false}
      >
        {"Finn kandidater"}
        <br />
        {stillingsAnnonseTekst}
      </Lenkepanel>
    </div>
  );
};

export default Pamboks;
