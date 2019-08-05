import React, { FunctionComponent, useContext, useState } from "react";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../VirksomhetsVelgerNiva1/OrganisasjonsVisning/OrganisasjonsVisning";
import MenyObjektNiva2 from "../VirksomhetsVelgerNiva1/MenyObjekt/VirksomhetsVelgerNiva2/MenyObjektNiva2/MenyObjektNiva2";

interface Props {
  className?: string;
  ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  const OrganisasjonsMenyKomponenter = props.ListeMedObjektFraSok.map(function(
    juridiskEnhet
  ) {
    const UnderOrganisasjonsMenyKomponenter = juridiskEnhet.UnderOrganisasjoner.map(
      function(underenhet: Organisasjon) {
        return (
          <MenyObjektNiva2
            organisasjon={underenhet}
            className={"virksomhets-velger-niva-2__meny-objekt"}
          />
        );
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

  return <>{OrganisasjonsMenyKomponenter}</>;
};

export default MenyEtterSok;
