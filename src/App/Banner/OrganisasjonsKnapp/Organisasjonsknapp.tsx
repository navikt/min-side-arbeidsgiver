import React, { FunctionComponent } from "react";
import "./OrganisasjonsKnapp.less";
import bedriftsikon from "./bedriftsikon.svg";
import { Element } from "nav-frontend-typografi";

import { OverenhetOrganisasjon } from "../../../organisasjon";

interface Props {
  className?: string;
  hovedOrganisasjon: OverenhetOrganisasjon;
}

const OrganisasjonsKnapp: FunctionComponent<Props> = props => {
  return (
    <div className={"ovre-button"}>
      <img src={bedriftsikon} />
      <div className="ovre-button-tekst">
        <Element>{props.hovedOrganisasjon.overordnetOrg.Name}</Element>
        org. nr. {props.hovedOrganisasjon.overordnetOrg.OrganizationNumber}
      </div>
    </div>
  );
};

export default OrganisasjonsKnapp;
