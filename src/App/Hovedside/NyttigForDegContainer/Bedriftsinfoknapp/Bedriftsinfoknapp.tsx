import React, { FunctionComponent, useContext } from "react";
import { Undertittel } from "nav-frontend-typografi";
import bedriftinfoikon from "./infoombedriftikon.svg";
import "./Bedriftsinfoknapp.less";
import Lenkepanel from "nav-frontend-lenkepanel";
import { basename } from "../../../../paths";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";

const Bedriftsinfoknapp: FunctionComponent = () => {
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  return (
    <Lenkepanel
      href={
        basename +
        "/" +
        valgtOrganisasjon.OrganizationNumber +
        "/bedriftsinformasjon"
      }
      className={"bedriftsinfo-knapp"}
      tittelProps={"undertittel"}
      linkCreator={(props: any) => <a {...props}>{props.children}</a>}
    >
      <div className={"bedriftsinfo-knapp__wrapper"}>
        <img
          className={"bedriftsinfo-knapp__ikon"}
          src={bedriftinfoikon}
          alt="Bilde av stresskoffert"
        />
        <Undertittel className={"bedriftsinfo-knapp__tekst"}>
          Informasjon om din bedrift
        </Undertittel>
      </div>
    </Lenkepanel>
  );
};

export default Bedriftsinfoknapp;
