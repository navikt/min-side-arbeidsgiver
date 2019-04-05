import React, { FunctionComponent } from "react";

import { pamLink } from "../../../lenker";
import rekrutteringsIkon from "../iconRekruttering.svg";
import TjenesteBoks from "./TjenesteBoks";

const Pamboks: FunctionComponent = () => {
  return (
    <TjenesteBoks
      tittel={"Rekruttering"}
      undertekst={""}
      bildeurl={rekrutteringsIkon}
      lenketekst={"Gå til rekruttering"}
      lenke={pamLink()}
    />
  );
};

export default Pamboks;
