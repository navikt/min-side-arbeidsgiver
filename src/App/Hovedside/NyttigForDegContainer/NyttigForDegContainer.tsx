import React, { FunctionComponent } from "react";
import Bedriftsinfoknapp from "./Bedriftsinfoknapp/Bedriftsinfoknapp";
import "./NyttigForDegContainer.less";

const NyttigForDegContainer: FunctionComponent = () => {
  return (
    <div className={"nyttig-for-deg"}>
      <Bedriftsinfoknapp />
    </div>
  );
};

export default NyttigForDegContainer;
