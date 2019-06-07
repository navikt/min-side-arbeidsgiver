import React, { FunctionComponent } from "react";
import "./LoggInnBanner.less";
import Sidetittel from "nav-frontend-typografi/lib/sidetittel";

const LoggInnBanner: FunctionComponent = () => {
  return (
    <div className={"banner"}>
      <Sidetittel>NAVs tjenester for arbeidsgivere </Sidetittel>
      <Sidetittel>samlet på et sted </Sidetittel>
    </div>
  );
};

export default LoggInnBanner;
