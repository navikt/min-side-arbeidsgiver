import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import { Ingress } from "nav-frontend-typografi";

const Hovedside: FunctionComponent = () => {
  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <Ingress className={"forside__nyttigfordeg"}>
        {" "}
        Nyttig Nyttig for deg
      </Ingress>
      <NyttigForDegContainer />
    </div>
  );
};

export default Hovedside;
