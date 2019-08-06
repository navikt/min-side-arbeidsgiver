import React, { FunctionComponent } from "react";

import OrganisasjonsVisning from "../VirksomhetsVelgerNiva1/OrganisasjonsVisning/OrganisasjonsVisning";

import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";
import MenyObjektNiva2 from "../VirksomhetsVelgerNiva1/MenyObjekt/VirksomhetsVelgerNiva2/MenyObjektNiva2/MenyObjektNiva2";

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
        <OrganisasjonsVisning
          hovedOrganisasjon={juridiskEnhet.overordnetOrg}
          className={"meny-objekt__juridisk-enhet"}
        />
        {UnderOrganisasjonsMenyKomponenter}
      </>
    );
  });

  return <>{menyKomponenter}</>;
};

export default MenyEtterSok;
