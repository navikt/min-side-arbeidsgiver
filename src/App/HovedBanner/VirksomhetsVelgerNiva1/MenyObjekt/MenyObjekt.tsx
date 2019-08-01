import React, { FunctionComponent, useContext } from "react";
import { OverenhetOrganisasjon } from "../../../../Objekter/organisasjon";
import "./MenyObjekt.less";
import OrganisasjonsVisning from "../OrganisasjonsVisning/OrganisasjonsVisning";
import VirksomhetsVelgerNiva2 from "./VirksomhetsVelgerNiva2/VirksomhetsVelgerNiva2";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className: string;
  organisasjon: OverenhetOrganisasjon;
}

const MenyObjekt: FunctionComponent<Props> = props => {
  return (
    <>
      <div className={props.className}>
        <OrganisasjonsVisning
          hovedOrganisasjon={props.organisasjon.overordnetOrg}
          className={"meny-objekt__juridisk-enhet"}
        />
        <AriaMenuButton.MenuItem value={props.organisasjon} />
      </div>
      <VirksomhetsVelgerNiva2 hovedOrganisasjon={props.organisasjon} />
    </>
  );
};

export default MenyObjekt;
