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
import ikon from "./infomation-circle-2.svg";

const Hovedside: FunctionComponent = () => {
  const { harNoenTilganger } = useContext(OrganisasjonsDetaljerContext);
  const { organisasjoner, organisasjonstre } = useContext(
    OrganisasjonsListeContext
  );
  const skalViseManglerTilgangBoks = !(
    organisasjoner.length > 0 || harNoenTilganger
  );

  return (
    <div className="hovedside">
      {skalViseManglerTilgangBoks && <ManglerTilgangBoks />}
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
      {!skalViseManglerTilgangBoks && (
        <div className={"hovedside__informasjonstekst"}>
          <img
            className={"hovedside__ikon"}
            src={ikon}
            alt="informasjonsikon"
          />
          Forventet du å se flere tjenester?
          <Lenke
            className={"hovedside__lenke"}
            href={basename + "/informasjon-om-tilgangsstyring"}
          >
            Les mer om hvordan du får tilgang
          </Lenke>{" "}
        </div>
      )}
    </div>
  );
};

export default Hovedside;
