import React, { FunctionComponent } from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import Lenke from "nav-frontend-lenker";
import "./ArbeidsgiverTelefon.less";
import iconTlf from "./arbeidsgivertlfikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";

const ArbeidsgiverTelefon: FunctionComponent = () => {
  return (
    <Lenkepanel
      className={"arbeidsgivertelefon"}
      href={"tel:55-55-33-36"}
      tittelProps={"undertittel"}
      linkCreator={(props: any) => (
        <a target="_blank" {...props}>
          {props.children}
        </a>
      )}
    >
      <Undertittel>{"Arbeidsgivertelefonen"}</Undertittel>
      <div className={"arbeidsgivertelefon__innhold"}>
        <img className={"arbeidsgivertelefon__icon"} src={iconTlf} />
        <div className={"arbeidsgivertelefon__nrOgTidspunkt"}>
          <Lenke
            className={"arbeidsgivertelefon__nummer"}
            href="tel:55-55-33-36"
          >
            55 55 33 36
          </Lenke>
          <Normaltekst>Kl 08.00 - 15.30 (hverdager)</Normaltekst>
        </div>
      </div>
    </Lenkepanel>
  );
};

export default ArbeidsgiverTelefon;
