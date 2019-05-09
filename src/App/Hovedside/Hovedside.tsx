import React, { FunctionComponent } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import {logEvent, logInfo} from "../../utils/metricsUtils";

const Hovedside: FunctionComponent = () => {
    console.log("lasthovedside")
    logInfo("lasthovedside");
    (window as any).frontendlogger.info('Min melding fra hovedside');
  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
    </div>
  );
};

export default Hovedside;
