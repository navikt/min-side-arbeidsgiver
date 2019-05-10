import React, { FunctionComponent } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import {logEvent, logInfo} from "../../utils/metricsUtils";

const Hovedside: FunctionComponent = () => {
    console.log("console log lasthovedside");
    logInfo("lasthovedside");

  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
    </div>
  );
};

export default Hovedside;
