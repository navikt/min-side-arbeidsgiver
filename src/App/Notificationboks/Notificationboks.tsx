import React, { Component, FunctionComponent } from "react";
import "./Notificationboks.less";
import {
  Systemtittel,
  Normaltekst,
  Innholdstittel
} from "nav-frontend-typografi";
import PanelBase, { Panel } from "nav-frontend-paneler";
import Notification from "./Notification/Notification";

interface Props {
  tittel: string;
  bildeurl: string;
  undertittel: string;
  notification: boolean;
}

const Notificationboks: FunctionComponent<Props> = props => {
  return (
    <div>
      <Panel className={"bokspanel"} border={true}>
        {props.notification ? <Notification antall={"2"} /> : null}
        <img className={"icon"} src={props.bildeurl} />
        <Innholdstittel className={"hovedtittel"}>
          {props.tittel}
        </Innholdstittel>
        <Normaltekst>{props.undertittel}</Normaltekst>
      </Panel>
    </div>
  );
};

export default Notificationboks;
