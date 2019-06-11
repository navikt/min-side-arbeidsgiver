import React, { FunctionComponent } from "react";
import "./LoggInnBanner.less";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";
import ikonhender from "./hender-sjekkliste.svg";
import dialog from "./dialog.svg";

const LoggInnBanner: FunctionComponent = () => {
  return (
    <div className={"logg-inn-banner"}>
      <Sidetittel>NAVs tjenester for arbeidsgivere </Sidetittel>
      <Sidetittel>samlet på et sted </Sidetittel>
      <img
        src={ikonhender}
        alt={"hender som skriver en sjekklise med blyant"}
        className={"logg-inn-banner__hender-ikon"}
      />
      <img
        src={dialog}
        alt={"En lilla og en grå snakkeboble"}
        className={"logg-inn-banner__dialog-ikon"}
      />
    </div>
  );
};

export default LoggInnBanner;
