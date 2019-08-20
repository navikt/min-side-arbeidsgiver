import React, { FunctionComponent } from "react";

import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";
import MenyObjektNiva2 from "../MenyObjekt/VirksomhetsVelgerNiva2/MenyObjektNiva2/MenyObjektNiva2";
import OrganisasjonsVisning from "../OrganisasjonsVisning/OrganisasjonsVisning";
import "../MenyObjekt/MenyObjekt.less";

export interface Props {
  ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  const menyKomponenter = props.ListeMedObjektFraSok.map(function(
    juridiskEnhet: OverenhetOrganisasjon
  ) {
    const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.UnderOrganisasjoner.map(
      function(org: Organisasjon) {
        return <MenyObjektNiva2 underEnhet={org} />;
      }
    );

    return (
      <>
        <div className={"meny-objekt__juridisk-enhet"}>
          <OrganisasjonsVisning
            hovedOrganisasjon={juridiskEnhet.overordnetOrg}
            className={"meny-objekt__juridisk-enhet"}
          />
        </div>
        {UnderOrganisasjonsMenyKomponenter}
      </>
    );
  });

  return <>{menyKomponenter}</>;
};

export default MenyEtterSok;
