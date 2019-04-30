import React, { FunctionComponent } from "react";
import syfoikon from "./syfoikon.svg";
import { syfoLink } from "../../../../lenker";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import Lenke from "nav-frontend-lenker";
import Innholdsboks from "../../Innholdsboks/Innholdsboks";
import "./Syfoboks.less";

interface Props {
  varseltekst?: string;
  className: string;
}

const Syfoboks: FunctionComponent<Props> = props => {
  return (
    <Innholdsboks className={"syfoboks " + props.className}>
      <div className={"syfoboks__tekst"}>
        <Undertittel className={"syfoboks__header"}>
          Dine sykemeldte
        </Undertittel>
        {props.varseltekst}
        <Lenke href={syfoLink()}>Gå til dine sykemeldte</Lenke>
      </div>
    </Innholdsboks>
  );
};

export default Syfoboks;
