import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import iconKontaktNav from "./kontaktossikon.svg";
import "./Bedriftsinfoknapp.less";
import { LenkepanelBase } from "nav-frontend-lenkepanel";
import { basename } from "../../../paths";

const Bedriftsinfoknapp: FunctionComponent = () => {
  return (
    <LenkepanelBase href={basename + "/bedriftsinformasjon"}>
      <div className={"kontakt-oss__wrapper"}>
        <img className={"kontakt-oss__ikon"} src={iconKontaktNav} />
        <Undertittel className={"kontakt-oss__tekst"}>
          Informasjon om din bedrift
        </Undertittel>
      </div>
    </LenkepanelBase>
  );
};

export default Bedriftsinfoknapp;
