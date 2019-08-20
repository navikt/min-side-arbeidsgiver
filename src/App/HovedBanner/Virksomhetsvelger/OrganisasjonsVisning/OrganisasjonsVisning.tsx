import React, { FunctionComponent } from "react";
import bedriftsikon from "./bedriftsikon.svg";
import hvittbedriftsikon from "./hvit-bedrift.svg";
import { Element } from "nav-frontend-typografi";
import { Organisasjon } from "../../../../Objekter/organisasjon";
import underenhetikon from "./underenhet-ikon.svg";
import underenhethvit from "./hvit-underenhet.svg";
import "./Organisasjonsvisning.less";

interface Props {
  className: string;
  hovedOrganisasjon: Organisasjon;
}

const OrganisasjonsVisning: FunctionComponent<Props> = props => {
  return (
    <div className={props.className}>
      <img
        alt={"ikon for bedrift"}
        className={props.className + "__bedrifts-ikon"}
        src={bedriftsikon}
      />
      <img
        alt={"ikon for underenhet"}
        className={props.className + "__underenhet-ikon"}
        src={underenhetikon}
      />
      <img
        alt={"ikon for underenhet"}
        className={props.className + "__underenhet-hvit"}
        src={underenhethvit}
      />
      <img
        alt={"hvitt ikon"}
        className={props.className + "__hvitt-ikon"}
        src={hvittbedriftsikon}
      />
      <div className={props.className + "__tekst"}>
        <Element>{props.hovedOrganisasjon.Name}</Element>
        org. nr. {props.hovedOrganisasjon.OrganizationNumber}
      </div>
    </div>
  );
};

export default OrganisasjonsVisning;
