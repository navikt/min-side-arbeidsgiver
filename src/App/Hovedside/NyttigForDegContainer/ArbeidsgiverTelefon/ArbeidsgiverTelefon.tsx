import React, { FunctionComponent } from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import "./ArbeidsgiverTelefon.less";
import iconTlf from "./arbeidsgivertlfikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";

const ArbeidsgiverTelefon: FunctionComponent = () => {
  return (
    <Lenkepanel
      className={"arbeidsgivertelefon"}
      href={"tel:55-55-33-36"}
      tittelProps={"undertittel"}
      linkCreator={(props: any) => <a {...props}>{props.children}</a>}
    >
      <div className={"arbeidsgivertelefon__wrapper"}>
        <img
          className={"arbeidsgivertelefon__icon"}
          src={iconTlf}
          alt="Mann med kommunikasjonsutstyr"
        />
        <div className={"arbeidsgivertelefon__tekst"}>
          <Undertittel>{"Arbeidsgivertelefonen"}</Undertittel>
          <Undertittel className={"arbeidsgivertelefon__nummer"}>
            55 55 33 36
          </Undertittel>
          <Normaltekst>Kl 08.00 - 15.30 (hverdager)</Normaltekst>
        </div>
      </div>
    </Lenkepanel>
  );
};

export default ArbeidsgiverTelefon;
