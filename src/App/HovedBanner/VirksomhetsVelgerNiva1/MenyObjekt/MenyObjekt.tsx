import React, { FunctionComponent, useContext } from "react";

import { OverenhetOrganisasjon } from "../../../../Objekter/organisasjon";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";
import "./MenyObjekt.less";
import OrganisasjonsVisning from "../OrganisasjonsVisning/OrganisasjonsVisning";
import VirksomhetsVelgerNiva2 from "./VirksomhetsVelgerNiva2/VirksomhetsVelgerNiva2";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  organisasjon: OverenhetOrganisasjon;
}

const MenyObjekt: FunctionComponent<Props> = props => {
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  return (
    <>
      {props.organisasjon.overordnetOrg.OrganizationNumber !==
        valgtOrganisasjon.OrganizationNumber && (
        <>
          {" "}
          {props.organisasjon.overordnetOrg.Type === "Enterprise" && (
            <>
              <div className={"meny-objekt__juridisk-enhet"}>
                <OrganisasjonsVisning
                  hovedOrganisasjon={props.organisasjon.overordnetOrg}
                  className={"meny-objekt__juridisk-enhet"}
                />
                <AriaMenuButton.MenuItem value={props.organisasjon} />
              </div>
              <VirksomhetsVelgerNiva2 hovedOrganisasjon={props.organisasjon} />
            </>
          )}
          {props.organisasjon.overordnetOrg.Type !== "Enterprise" && (
            <AriaMenuButton.MenuItem
              className={"meny-objekt__under-enhet"}
              tabIndex={0}
              value={props.organisasjon}
            >
              <OrganisasjonsVisning
                hovedOrganisasjon={props.organisasjon.overordnetOrg}
                className={"meny-objekt__under-enhet"}
              />
            </AriaMenuButton.MenuItem>
          )}
        </>
      )}
    </>
  );
};

export default MenyObjekt;
