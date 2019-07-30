import React, { FunctionComponent } from "react";
import { Element, Normaltekst } from "nav-frontend-typografi";
import "./ArbeidsgiverTelefon.less";
import iconTlf from "./mobil.svg";
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
          className={"arbeidsgivertelefon__ikon"}
          src={iconTlf}
          alt="Bilde av en mobiltelefon"
        />
        <div className={"arbeidsgivertelefon__tekst"}>
          <Element>{"Arbeidsgivertelefonen"}</Element>
          <Element className={"arbeidsgivertelefon__nummer"}>
            55 55 33 36
          </Element>
          <Normaltekst>Kl 08.00 - 15.30 (hverdager)</Normaltekst>
        </div>
      </div>
    </Lenkepanel>
  );
};

export default ArbeidsgiverTelefon;
