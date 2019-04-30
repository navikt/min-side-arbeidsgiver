import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";

const Hovedside: FunctionComponent = () => {
  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
    </div>
  );
};

export default Hovedside;
