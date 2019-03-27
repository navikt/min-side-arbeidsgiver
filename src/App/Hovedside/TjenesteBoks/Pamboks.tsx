import React, { FunctionComponent } from "react";

import { pamLink } from "../../../lenker";
import TjenesteBoks from "../Hovedside";
import rekrutteringsIkon from "../iconRekruttering.svg";

const Pamboks: FunctionComponent = () => {
  return (
    <TjenesteBoks>
      tittel={"Rekruttering"}
      undertekst={"Utlys stillinger, finn kandidater og se deres annonser."}
      bildeurl={rekrutteringsIkon}
      lenketekst={"Gå til rekruttering"}
      lenke={pamLink}
    </TjenesteBoks>
  );
};

export default Pamboks;
