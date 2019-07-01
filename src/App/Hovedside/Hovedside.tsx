import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import ManglerTilgangBoks from "./ManglerTilgangBoks/ManglerTilgangBoks";

import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { basename } from "../../paths";
import Lenke from "nav-frontend-lenker";
import { Innholdstittel } from "nav-frontend-typografi";
import DropDown from "../Banner/DropDown/DropDown";

const Hovedside: FunctionComponent = () => {
  const { harNoenTilganger } = useContext(OrganisasjonsDetaljerContext);
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const skalViseManglerTilgangBoks = !(
    organisasjoner.length > 0 || harNoenTilganger
  );

  return (
    <div className="forside">
      {organisasjoner.length > 0 && <DropDown />}
      {organisasjoner.length === 0 && (
        <Innholdstittel className={"forside__overskrift"}>
          Min bedriftsside
        </Innholdstittel>
      )}
      {skalViseManglerTilgangBoks && <ManglerTilgangBoks />}
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
      {!skalViseManglerTilgangBoks && (
        <div>
          Forventet du å se flere tjenester? Les om hvordan tilgangsstyringen
          fungerer{" "}
          <Lenke href={basename + "/informasjon-om-tilgangsstyring"}>
            her.
          </Lenke>{" "}
        </div>
      )}
    </div>
  );
};

export default Hovedside;
