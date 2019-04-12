import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import { pamRekruttering, pamStillingsannonser } from "../../../lenker";
import pamikon from "./pamikon.svg";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import "./Pamboks.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";

const Pamboks: FunctionComponent = () => {
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
    <Innholdsboks className={"pamboks"}>
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
