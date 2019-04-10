import React, { FunctionComponent } from "react";

import { pamRekruttering, pamStillingsannonser } from "../../../lenker";
import pamikon from "./pamikon.svg";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import "./Pamboks.less";

interface Props {
  varseltekst?: string;
}

const Pamboks: FunctionComponent<Props> = props => {
  return (
    <Innholdsboks className={"pamboks"}>
      <img className={"pamboks__icon"} src={pamikon} />
      <div className={"pamboks__tekst"}>
        <Undertittel className={"pamboks__header"}>Rekruttering</Undertittel>
        <Normaltekst>{props.varseltekst}</Normaltekst>
        <Lenke href={pamStillingsannonser()}>Stillingsannonser</Lenke>
        <Lenke href={pamRekruttering()}>Finn kandidater</Lenke>
      </div>
    </Innholdsboks>
  );
};

export default Pamboks;
