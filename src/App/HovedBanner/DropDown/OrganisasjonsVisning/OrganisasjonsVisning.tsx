import React, { FunctionComponent } from "react";
import "./OrganisasjonsVisning.less";
import bedriftsikon from "./bedriftsikon.svg";
import hvittbedriftsikon from "./hvit-bedrift.svg";
import { Element } from "nav-frontend-typografi";
import { Organisasjon } from "../../../../Objekter/organisasjon";

interface Props {
  className?: string;
  hovedOrganisasjon: Organisasjon;
}

const OrganisasjonsVisning: FunctionComponent<Props> = props => {
  return (
    <div className={"organisasjons-visning"}>
      <img className={"bedrifts-ikon"} src={bedriftsikon} />
      <img className={"hvitt-ikon"} src={hvittbedriftsikon} />
      <div className="organisasjons-visning__tekst">
        <Element>{props.hovedOrganisasjon.Name}</Element>
        org. nr. {props.hovedOrganisasjon.OrganizationNumber}
      </div>
    </div>
  );
};

export default OrganisasjonsVisning;
