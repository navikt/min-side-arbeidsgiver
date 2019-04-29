import React, { FunctionComponent, useContext } from "react";

import "./Hovedside.less";

import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";

const Hovedside: FunctionComponent = () => {
  return (
    <div className="forside">
      <TjenesteBoksContainer />
    </div>
  );
};

export default Hovedside;
