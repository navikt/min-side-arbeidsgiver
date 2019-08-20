import React, { FunctionComponent } from "react";
import "./MenyObjektNiva2.less";

import OrganisasjonsVisning from "../../../OrganisasjonsVisning/OrganisasjonsVisning";
import { Organisasjon } from "../../../../../../Objekter/organisasjon";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  underEnhet: Organisasjon;
}

const MenyObjektNiva2: FunctionComponent<Props> = ({ underEnhet }) => {
  return (
    <AriaMenuButton.MenuItem
      key={underEnhet.OrganizationNumber}
      value={underEnhet.OrganizationNumber}
      text={underEnhet.Name}
      tabIndex={0}
      className="virksomhets-velger-niva-2__meny-objekt"
    >
      <OrganisasjonsVisning
        hovedOrganisasjon={underEnhet}
        className={"virksomhets-velger-niva-2__meny-objekt"}
      />
    </AriaMenuButton.MenuItem>
  );
};

export default MenyObjektNiva2;
