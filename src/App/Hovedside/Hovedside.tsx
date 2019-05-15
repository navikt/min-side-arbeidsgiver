import React, { FunctionComponent } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import {logInfo} from "../../utils/metricsUtils";

const Hovedside: FunctionComponent = () => {
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
