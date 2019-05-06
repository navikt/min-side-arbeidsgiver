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
        <div className={"nyttig-for-deg__innholdsboks"}>
          <Bedriftsinfoknapp />
        </div>
        <div className={"nyttig-for-deg__innholdsboks"}>
          <KontaktOss />
        </div>
        <div className={"nyttig-for-deg__innholdsboks"}>
          <ArbeidsgiverTelefon />
        </div>
      </div>
    </div>
  );
};

export default NyttigForDegContainer;
