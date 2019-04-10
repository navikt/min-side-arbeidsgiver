import React, { FunctionComponent } from "react";

import { pamLink } from "../../../lenker";
import rekrutteringsIkon from "../iconRekruttering.svg";
import TjenesteBoks from "./TjenesteBoks";
interface Props {
  andrelenke?: string;
  andrelenketekst?: string;
}

const Pamboks: FunctionComponent<Props> = props => {
  return (
    <TjenesteBoks
      tittel={"Rekruttering"}
      bildeurl={rekrutteringsIkon}
      andrelenke={props.andrelenke}
      andrelenketekst={props.andrelenketekst}
      forstelenketekst={"Finn kandidater"}
      forstelenke={pamLink()}
    />
  );
};

export default Pamboks;
