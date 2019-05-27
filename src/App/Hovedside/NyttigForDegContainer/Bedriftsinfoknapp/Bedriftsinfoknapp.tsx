import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import bedriftinfoikon from "./infoombedriftikon.svg";
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
        <a {...props}>
          {props.children}
        </a>
      )}
    >
      <div className={"bedriftsinfo-knapp__wrapper"}>
        <img
          className={"bedriftsinfo-knapp__ikon"}
          src={bedriftinfoikon}
          alt="Stresskoffert"
        />
        <Undertittel className={"bedriftsinfo-knapp__tekst"}>
          Informasjon om din bedrift
        </Undertittel>
      </div>
    </Lenkepanel>
  );
};

export default Bedriftsinfoknapp;
