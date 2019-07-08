import React, { FunctionComponent } from "react";
import "./OrganisasjonsKnapp.less";
import bedriftsikon from "./bedriftsikon.svg";
import { Element } from "nav-frontend-typografi";

import { Organisasjon } from "../../../organisasjon";

interface Props {
  className?: string;
  hovedOrganisasjon: Organisasjon;
}

const OrganisasjonsKnapp: FunctionComponent<Props> = props => {
  return (
    <div className={"ovre-button"}>
      <img src={bedriftsikon} />
      <div className="ovre-button-tekst">
        <Element>{props.hovedOrganisasjon.Name}</Element>
        org. nr. {props.hovedOrganisasjon.OrganizationNumber}
      </div>
    </div>
  );
};

export default OrganisasjonsKnapp;
