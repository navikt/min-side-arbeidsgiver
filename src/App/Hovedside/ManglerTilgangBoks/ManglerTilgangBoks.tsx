import React, { FunctionComponent } from "react";
import "./ManglerTilgangBoks.less";
import alertikon from "./infomation-circle-2.svg";
import { basename } from "../../../paths";
import Lenke from "nav-frontend-lenker";
import { Element } from "nav-frontend-typografi";

interface Props {
  className?: string;
}

export const ManglerTilgangBoks: FunctionComponent<Props> = props => {
  return (
    <div className={"mangler-tilgang"}>
      <img src={alertikon} alt={""} className={"mangler-tilgang__ikon"} />
      <div className={"mangler-tilgang__tekst"}>
        <Element className={"mangler-tilgang__overskrift"}>
          Du mangler roller eller rettigheter i Altinn{" "}
        </Element>
        For å se innholdet på denne siden må du være registrert med visse roller
        og rettigheter i Altinn
        <br />
        <br />
        <Lenke
          className={"mangler-tilgang__lenke"}
          href={basename + "/informasjon-om-tilgangsstyring"}
        >
          Les mer om hvordan du får tilgang.
        </Lenke>
      </div>
    </div>
  );
};

export default ManglerTilgangBoks;
