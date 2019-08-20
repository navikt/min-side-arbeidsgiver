import React, { FunctionComponent } from "react";
import { OverenhetOrganisasjon } from "../../../../Objekter/organisasjon";
import "./JuridiskEnhetMedUnderenheter.less";
import OrganisasjonsVisning from "../OrganisasjonsVisning/OrganisasjonsVisning";
import Underenhetsvelger from "./Underenhetsvelger/Underenhetsvelger";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className: string;
  organisasjon: OverenhetOrganisasjon;
}

const JuridiskEnhetMedUnderenheter: FunctionComponent<Props> = props => {
  return (
    <>
      <OrganisasjonsVisning
        hovedOrganisasjon={props.organisasjon.overordnetOrg}
        className={"juridisk-enhet"}
      />
      <AriaMenuButton.MenuItem value={props.organisasjon} />

      <Underenhetsvelger hovedOrganisasjon={props.organisasjon} />
    </>
  );
};

export default JuridiskEnhetMedUnderenheter;
