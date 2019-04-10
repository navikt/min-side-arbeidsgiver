import React, { FunctionComponent } from "react";
import "./TjenesteBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import Innholdsboks from "../Innholdsboks/Innholdsboks";

interface Props {
  tittel: string;
  bildeurl: string;
  forstelenke: string;
  andrelenke?: string;
  forstelenketekst: string;
  andrelenketekst?: string;
  varseltekst?: string;
}

const TjenesteBoks: FunctionComponent<Props> = props => {
  return (
    <Innholdsboks className={"tjenesteboks"}>
      <img className={"tjenesteboks__icon"} src={props.bildeurl} />
      <div className={"tjenesteboks__tekstboks"}>
        <Undertittel className={"tjenesteboks__header"}>
          {props.tittel}
        </Undertittel>
        <Normaltekst>{props.varseltekst}</Normaltekst>
        <Lenke href={props.forstelenke}>{props.forstelenketekst}</Lenke>
      </div>
    </Innholdsboks>
  );
};

export default TjenesteBoks;
