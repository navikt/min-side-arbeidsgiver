import React, { FunctionComponent } from "react";

import "./Hovedside.less";
import TjenesteBoksContainer from "./TjenesteBoksContainer/TjenesteBoksContainer";
import NyttigForDegContainer from "./NyttigForDegContainer/NyttigForDegContainer";
import AltinnContainer from "./AltinnContainer/AltinnContainer";
import {DetaljertArbeidsforhold} from "@navikt/arbeidsforhold";


const Hovedside: FunctionComponent = () => {
    const arbeidsforholdId = "konvertert_af709505-128e-45dc-a241-7e14180f787d";
  return (
    <div className="forside">
      <TjenesteBoksContainer />
      <NyttigForDegContainer />
      <AltinnContainer />

        <DetaljertArbeidsforhold arbeidsforholdId={arbeidsforholdId} />
    </div>
  );
};

export default Hovedside;
