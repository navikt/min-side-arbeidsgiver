import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import ManglerTilgangBoks from "./ManglerTilgangBoks/ManglerTilgangBoks";

import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";

const Hovedside: FunctionComponent = () => {
  const { harNoenTilganger } = useContext(OrganisasjonsDetaljerContext);
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const skalViseManglerTilgangBoks = !(
    organisasjoner.length > 0 || harNoenTilganger
  );

  return (
    <div className="forside">
      {skalViseManglerTilgangBoks && <ManglerTilgangBoks />}
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
    </div>
  );
};

export default Hovedside;
