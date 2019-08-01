import React, { FunctionComponent } from "react";
import bedriftsikon from "./bedriftsikon.svg";
import hvittbedriftsikon from "./hvit-bedrift.svg";
import { Element } from "nav-frontend-typografi";
import { Organisasjon } from "../../../../Objekter/organisasjon";
import underenhetikon from "./underenhet-ikon.svg";

interface Props {
  className?: string;
  hovedOrganisasjon: Organisasjon;
}

const OrganisasjonsVisning: FunctionComponent<Props> = props => {
  return (
    <>
      <img className={props.className + "__bedrifts-ikon"} src={bedriftsikon} />
      <img
        className={props.className + "__underenhet-ikon"}
        src={underenhetikon}
      />
      <img
        className={props.className + "__hvitt-ikon"}
        src={hvittbedriftsikon}
      />
      <div className={props.className + "__tekst"}>
        <Element>{props.hovedOrganisasjon.Name}</Element>
        org. nr. {props.hovedOrganisasjon.OrganizationNumber}
      </div>
    </>
  );
};

export default OrganisasjonsVisning;
