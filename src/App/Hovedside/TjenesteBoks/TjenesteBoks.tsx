import React, { FunctionComponent } from "react";
import "./TjenesteBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import Innholdsboks from "../Innholdsboks/Innholdsboks";

interface Props {
  tittel: string;
  bildeurl: string;
  undertekst: string;
  lenke: string;
  lenketekst: string;
}

const TjenesteBoks: FunctionComponent<Props> = props => {
  return (
    <Innholdsboks>
      <div className={"tjenesteboks"}>
        <img className={"tjenesteboks__icon"} src={props.bildeurl} />
        <div className={"tjenesteboks__tekstboks"}>
          <Undertittel className={"tjenesteboks__header"}>
            {props.tittel}
          </Undertittel>
          <Normaltekst className={"tjenesteboks__undertekst"}>
            {props.undertekst}
          </Normaltekst>
          <Lenke href={props.lenke}>{props.lenketekst}</Lenke>
        </div>
      </div>
    </Innholdsboks>
  );
};

export default TjenesteBoks;
