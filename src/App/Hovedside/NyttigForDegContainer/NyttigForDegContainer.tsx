import React, { FunctionComponent } from "react";
import Bedriftsinfoknapp from "./Bedriftsinfoknapp/Bedriftsinfoknapp";
import "./NyttigForDegContainer.less";
import KontaktOss from "./KontaktOss/KontaktOss";
import ArbeidsgiverTelefon from "./ArbeidsgiverTelefon/ArbeidsgiverTelefon";
import { Ingress } from "nav-frontend-typografi";

const NyttigForDegContainer: FunctionComponent = () => {
  return (
    <div className={"nyttig-for-deg"}>
      <Ingress className={"nyttig-for-deg__tekst"}>Nyttig for deg</Ingress>
      <div className={"nyttig-for-deg__bokser"}>
        <Bedriftsinfoknapp />
        <KontaktOss />
        <ArbeidsgiverTelefon />
      </div>
    </div>
  );
};

export default NyttigForDegContainer;
