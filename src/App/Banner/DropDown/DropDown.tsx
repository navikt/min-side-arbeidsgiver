import React, { FunctionComponent, useContext } from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
import { Systemtittel } from "nav-frontend-typografi";

const LoggInnBanner: FunctionComponent = () => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  return (
    <div className={"logg-inn-banner"}>
      <Systemtittel>Ditt NAV arbeidsgiver </Systemtittel>
    </div>
  );
};

export default LoggInnBanner;
