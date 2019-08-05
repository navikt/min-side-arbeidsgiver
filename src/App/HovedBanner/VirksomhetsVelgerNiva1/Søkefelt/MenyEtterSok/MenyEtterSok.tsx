import React, { FunctionComponent } from "react";
import "./MenyObjektNiva2.less";
import { Organisasjon } from "../../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../../OrganisasjonsVisning/OrganisasjonsVisning";
import MenyObjekt from "../../MenyObjekt/MenyObjekt";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  ListeMedResultatEtterSok: Organisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  const OrganisasjonsMenyKomponenter = props.ListeMedResultatEtterSok.UnderOrganisasjoner.map(
    function(organisasjon: Organisasjon) {
      return <MenyObjekt UnderEnhet={organisasjon} />;
    }
  );
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

export default MenyEtterSok;
