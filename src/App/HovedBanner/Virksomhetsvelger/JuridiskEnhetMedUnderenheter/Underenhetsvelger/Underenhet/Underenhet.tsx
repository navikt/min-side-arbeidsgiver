import React, { FunctionComponent } from "react";
import "./Underenhet.less";

import { Organisasjon } from "../../../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../../../OrganisasjonsVisning/OrganisasjonsVisning";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  underEnhet: Organisasjon;
}

const Underenhet: FunctionComponent<Props> = ({ underEnhet }) => {
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

export default Underenhet;
