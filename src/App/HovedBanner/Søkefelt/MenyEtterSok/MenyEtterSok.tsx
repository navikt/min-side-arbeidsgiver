import React, { FunctionComponent, useContext, useState } from "react";
import { OverenhetOrganisasjon } from "../../../../Objekter/organisasjon";
import MenyObjekt from "../VirksomhetsVelgerNiva1/MenyObjekt/MenyObjekt";
import MenyObjektNiva2 from "../VirksomhetsVelgerNiva1/MenyObjekt/VirksomhetsVelgerNiva2/MenyObjektNiva2/MenyObjektNiva2";

interface Props {
  className?: string;
  ListeMedObjektFraSok: OverenhetOrganisasjon[];
}

const MenyEtterSok: FunctionComponent<Props> = props => {
  const OrganisasjonsMenyKomponenter = props.ListeMedObjektFraSok.map(function(
    organisasjon
  ) {
    const UnderOrganisasjonsMenyKomponenter = organisasjon.UnderOrganisasjoner.map(
      function(underenhet) {
        return <MenyObjektNiva2 UnderEnhet={underenhet} />;
      }
    );

    return (
      <>
        <MenyObjekt
          organisasjon={organisasjon}
          className={"meny-objekt__juridisk-enhet"}
        />
        {UnderOrganisasjonsMenyKomponenter}
      </>
    );
  });

  return <>{OrganisasjonsMenyKomponenter}</>;
};

export default MenyEtterSok;
