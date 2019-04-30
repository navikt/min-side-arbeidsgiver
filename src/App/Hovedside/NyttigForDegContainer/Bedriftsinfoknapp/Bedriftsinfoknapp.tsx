import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import iconKontaktNav from "./kontaktossikon.svg";
import "./Bedriftsinfoknapp.less";
import { LenkepanelBase } from "nav-frontend-lenkepanel";
import { basename } from "../../../../paths";
import Innholdsboks from "../../Innholdsboks/Innholdsboks";

const Bedriftsinfoknapp: FunctionComponent = () => {
  return (
    <Innholdsboks className={"bedriftsinformasjon"}>
      <LenkepanelBase href={basename + "/bedriftsinformasjon"}>
        <img className={"bedriftsinformasjon__ikon"} src={iconKontaktNav} />
        <Undertittel className={"bedriftsinformasjon__tekst"}>
          Informasjon om din bedrift
        </Undertittel>
      </LenkepanelBase>
    </Innholdsboks>
  );
};

export default Bedriftsinfoknapp;
