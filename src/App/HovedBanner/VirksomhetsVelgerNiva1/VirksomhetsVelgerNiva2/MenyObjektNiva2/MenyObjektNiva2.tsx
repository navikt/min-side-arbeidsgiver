import React, { FunctionComponent } from "react";
import "./MenyObjektNiva2.less";

import { Organisasjon } from "../../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../../OrganisasjonsVisning/OrganisasjonsVisning";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  UnderEnhet: Organisasjon;
}

const MenyObjektNiva2: FunctionComponent<Props> = props => {
  return (
    <AriaMenuButton.MenuItem
      key={props.UnderEnhet.OrganizationNumber}
      value={props.UnderEnhet.OrganizationNumber}
      text={props.UnderEnhet.Name}
      tabIndex={0}
      className="virksomhets-velger-niva-2__meny-objekt"
    >
      <OrganisasjonsVisning
        hovedOrganisasjon={props.UnderEnhet}
        className={"virksomhets-velger-niva-2__meny-objekt"}
      />
    </AriaMenuButton.MenuItem>
  );
};

export default MenyObjektNiva2;
