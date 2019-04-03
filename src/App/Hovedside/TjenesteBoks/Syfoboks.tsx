import React, { FunctionComponent } from "react";
import sykeIkon from "../iconSykemeldte.svg";
import { syfoLink } from "../../../lenker";
import TjenesteBoks from "./TjenesteBoks";

const Syfoboks: FunctionComponent = () => {
  return (
    <TjenesteBoks
      tittel={"Dine sykemeldte"}
      undertekst={""}
      bildeurl={sykeIkon}
      lenketekst={"Gå til dine sykemeldte"}
      lenke={syfoLink()}
    />
  );
};

export default Syfoboks;
