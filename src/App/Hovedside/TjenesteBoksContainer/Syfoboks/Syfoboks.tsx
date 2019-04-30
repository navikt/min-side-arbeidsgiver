import React, { FunctionComponent } from "react";
import syfoikon from "./syfoikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import Innholdsboks from "../../Innholdsboks/Innholdsboks";
import "./Syfoboks.less";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";

interface Props {
  varseltekst?: string;
  className: string;
}

const Syfoboks: FunctionComponent<Props> = props => {
  return (
    <Innholdsboks className={"syfoboks " + props.className}>
      <TjenesteBoksBanner tittel={"Sykemeldte"} imgsource={syfoikon} />
      <Lenkepanel
        className={"__sykemeldte"}
        href={syfoLink()}
        tittelProps={"normaltekst"}
      >
        6 sykemeldte som du har ansvar for å følge opp
      </Lenkepanel>
    </Innholdsboks>
  );
};

export default Syfoboks;
