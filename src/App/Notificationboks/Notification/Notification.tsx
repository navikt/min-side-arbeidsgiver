import { FunctionComponent } from "react";
import "./Notification.less";

import React from "react";
import {
  EtikettLiten,
  Normaltekst,
  Systemtittel
} from "nav-frontend-typografi";

interface Props {
  antall: string;
}

const Notification: FunctionComponent<Props> = props => {
  return (
    <div className={"notification"}>
      <Systemtittel className={"notification__antall"}>
        {props.antall}
      </Systemtittel>
    </div>
  );
};

export default Notification;
