import React, { FunctionComponent } from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import Lenke from "nav-frontend-lenker";
import "./ArbeidsgiverTelefon.less";
import iconTlf from "../iconSykemeldte.svg";

const ArbeidsgiverTelefon: FunctionComponent = () => {
  return (
    <Innholdsboks>
      <div className={"arbeidsgivertelefon"}>
        <Undertittel>{"Arbeidsgivertelefonen"}</Undertittel>
        <div className={"containerinnhold"}>
          <img className={"icontlf"} src={iconTlf} />
          <div className={"containerNrogTidspunkt"}>
            <Lenke className={"linknummer"} href="tel:55-55-33-36">
              55 55 33 36
            </Lenke>
            <Normaltekst>{"Kl 08.00 - 15.30 (hverdager)"}</Normaltekst>
          </div>
        </div>
      </div>
    </Innholdsboks>
  );
};

export default ArbeidsgiverTelefon;
