import React, { Component, FunctionComponent } from "react";
import "./Oppgave.less";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { Panel } from "nav-frontend-paneler";
import Lenke from "nav-frontend-lenker";

interface Props {
  className: string;
  tittel: string;
  bildeurl: string;
  undertekst: string;
  lenke: string;
  lenketekst: string;
}

const Oppgave: FunctionComponent<Props> = props => {
  return (
    <Panel className={"container"} border={true}>
      <img className={"container__icon"} src={props.bildeurl} />
      <div className={"container__tekstboks"}>
        <Undertittel className={"container__tekstboks__header"}>
          {props.tittel}
        </Undertittel>
        <Normaltekst className={"container__tekstboks__undertekst"}>
          {props.undertekst}
        </Normaltekst>
        <Lenke className={"container__tekstboks__lenke"} href={props.lenke}>
          {props.lenketekst}
        </Lenke>
      </div>
    </Panel>
  );
};

export default Oppgave;
