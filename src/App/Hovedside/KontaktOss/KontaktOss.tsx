import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import Innholdsboks from "../Innholdsboks/Innholdsboks";

const KontaktOss: FunctionComponent = () => {
  return (
    <Innholdsboks>
      <div className={"kontaktNAV"}>
        <Undertittel>{"Kom i kontakt med NAV"}</Undertittel>
      </div>
    </Innholdsboks>
  );
};

export default KontaktOss;
