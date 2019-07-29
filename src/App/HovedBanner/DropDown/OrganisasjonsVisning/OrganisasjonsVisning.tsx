import React, { FunctionComponent } from "react";
import "./OrganisasjonsVisning.less";
import bedriftsikon from "./bedriftsikon.svg";
import { Element } from "nav-frontend-typografi";
import { Organisasjon } from "../../../../Objekter/organisasjon";

interface Props {
  className?: string;
  hovedOrganisasjon: Organisasjon;
}

const OrganisasjonsVisning: FunctionComponent<Props> = props => {
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

export default OrganisasjonsVisning;
