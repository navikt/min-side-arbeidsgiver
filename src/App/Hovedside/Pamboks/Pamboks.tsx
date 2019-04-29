import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import pamikon from "./pamikon.svg";
import Lenke from "nav-frontend-lenker";
import "./Pamboks.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import { pamRekruttering, pamStillingsannonser } from "../../../lenker";
import { Normaltekst, Undertittel } from "nav-frontend-typografi";

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
      setStillingsAnnonseTekst("Stillingsannonser");
    }
  });

  return (
    <Innholdsboks className={"pamboks " + props.className}>
      <img className={"pamboks__icon"} src={pamikon} />
      <div className={"pamboks__tekst"}>
        <Undertittel className={"pamboks__header"}>Rekruttering</Undertittel>
        {antallAnnonser > 0 && (
          <Normaltekst>
            {antallAnnonser.toString() + " aktive stillingsannonser"}
          </Normaltekst>
        )}
        <Lenke href={pamStillingsannonser()}>{stillingsAnnonseTekst}</Lenke>
        <Lenke href={pamRekruttering()}>Finn kandidater</Lenke>
      </div>
    </Innholdsboks>
  );
};

export default Pamboks;
