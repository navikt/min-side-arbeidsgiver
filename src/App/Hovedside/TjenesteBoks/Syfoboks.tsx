import React, { FunctionComponent } from "react";
import syfoikon from "./syfoikon.svg";
import { syfoLink } from "../../../lenker";
import TjenesteBoks from "./TjenesteBoks";

interface Props {
  varseltekst?: string;
}

const Syfoboks: FunctionComponent<Props> = props => {
  return (
    <TjenesteBoks
      tittel={"Dine sykemeldte"}
      bildeurl={syfoikon}
      forstelenketekst={"Gå til dine sykemeldte"}
      forstelenke={syfoLink()}
      varseltekst={props.varseltekst}
    />
  );
};

export default Syfoboks;
