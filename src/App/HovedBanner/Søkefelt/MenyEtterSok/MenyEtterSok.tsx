import React, { FunctionComponent } from "react";

import OrganisasjonsVisning from "../VirksomhetsVelgerNiva1/OrganisasjonsVisning/OrganisasjonsVisning";
import MenyObjektNiva2 from "../VirksomhetsVelgerNiva1/MenyObjekt/VirksomhetsVelgerNiva2/MenyObjektNiva2/MenyObjektNiva2";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";

export interface Props {
  ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  const menyKomponenter = props.ListeMedObjektFraSok.map(function(
    juridiskEnhet: OverenhetOrganisasjon
  ) {
    const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.UnderOrganisasjoner.map(
      function(underenhet: Organisasjon) {
        return <MenyObjektNiva2 organisasjon={underenhet} />;
      }
    );

    return (
      <>
        <OrganisasjonsVisning
          organisasjon={juridiskEnhet.overordnetOrg}
          className={"meny-objekt__juridisk-enhet"}
        />
        {UnderOrganisasjonsMenyKomponenter}
      </>
    );
  });

  return <>{menyKomponenter}</>;
};

export default MenyEtterSok;
