import React, { FunctionComponent } from "react";
import Bedriftsinfoknapp from "./Bedriftsinfoknapp/Bedriftsinfoknapp";
import "./NyttigForDegContainer.less";
import KontaktOss from "./KontaktOss/KontaktOss";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";

const NyttigForDegContainer: FunctionComponent = () => {
  return (
    <div className={"nyttig-for-deg"}>
      <Bedriftsinfoknapp />
      <KontaktOss />
      <ArbeidsgiverTelefon />
    </div>
  );
};

export default NyttigForDegContainer;
