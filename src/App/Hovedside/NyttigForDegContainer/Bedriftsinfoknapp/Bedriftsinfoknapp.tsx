import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import iconKontaktNav from "./kontaktossikon.svg";
import "./Bedriftsinfoknapp.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { basename } from "../../../../paths";

const Bedriftsinfoknapp: FunctionComponent = () => {
  return (
    <Lenkepanel
      href={basename + "/bedriftsinformasjon"}
      className={"bedriftsinfo-knapp"}
      tittelProps={"undertittel"}
      linkCreator={(props: any) => (
        <a target="_blank" {...props}>
          {props.children}
        </a>
      )}
    >
      <div className={"bedriftsinfo-knapp__wrapper"}>
        <img className={"bedriftsinfo-knapp__ikon"} src={iconKontaktNav} />
        <Undertittel className={"bedriftsinfo-knapp__tekst"}>
          Informasjon om din bedrift
        </Undertittel>
      </div>
    </Lenkepanel>
  );
};

export default Bedriftsinfoknapp;
