import React, { Component, FunctionComponent } from "react";
import "./TjenesteBoks.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { Panel } from "nav-frontend-paneler";
import Lenke from "nav-frontend-lenker";

interface Props {
  tittel: string;
  bildeurl: string;
  undertekst: string;
  lenke: string;
  lenketekst: string;
}

const TjenesteBoks: FunctionComponent<Props> = props => {
  return (
    <Panel className={"tjenesteboks"} border={true}>
      <img className={"tjenesteboks__icon"} src={props.bildeurl} />
      <div className={"tjenesteboks__tekstboks"}>
        <Undertittel className={"tjenesteboks__tekstboks__header"}>
          {props.tittel}
        </Undertittel>
        <Normaltekst className={"tjenesteboks__tekstboks__undertekst"}>
          {props.undertekst}
        </Normaltekst>
        <Lenke className={"tjenesteboks__tekstboks__lenke"} href={props.lenke}>
          {props.lenketekst}
        </Lenke>
      </div>
    </Panel>
  );
};

export default TjenesteBoks;
