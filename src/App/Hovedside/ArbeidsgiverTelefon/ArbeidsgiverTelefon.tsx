import React, { FunctionComponent } from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Innholdsboks from "../Innholdsboks/Innholdsboks";

const ArbeidsgiverTelefon: FunctionComponent = () => {
  return (
    <Innholdsboks>
      <div className={"arbeidsgivertelefon"}>
        <Undertittel>{"Arbeidsgivertelefonen"}</Undertittel>
        <a className={"arbTlf"} href="tel:55-55-33-36">
          55 55 33 36
        </a>
        <Normaltekst>{"Kl 08.00 - 15.30 (hverdager)"}</Normaltekst>
      </div>
    </Innholdsboks>
  );
};

export default ArbeidsgiverTelefon;
