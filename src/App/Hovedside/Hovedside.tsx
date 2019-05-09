import React, { FunctionComponent } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";

const Hovedside: FunctionComponent = () => {
    (window as any).frontendlogger.info('Min melding');
  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />
    </div>
  );
};

export default Hovedside;
