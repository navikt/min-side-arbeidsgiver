import React, { FunctionComponent } from "react";
import "./MenyObjektNiva2.less";
import { Organisasjon } from "../../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../../OrganisasjonsVisning/OrganisasjonsVisning";
import MenyObjekt from "../../MenyObjekt/MenyObjekt";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  ListeMedResultatEtterSok: Organisasjon[];
  UnderEnhet: Organisasjon;
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  return (
    <AriaMenuButton.MenuItem
      key={"hello"}
      value={"hello"}
      text={"hello"}
      tabIndex={0}
      className="virksomhets-velger-niva-2__meny-objekt"
    />
  );
};

export default MenyEtterSok;
