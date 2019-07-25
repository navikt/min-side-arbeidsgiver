import React, { FunctionComponent } from "react";
import "./TilgangsStyringInfoTekst.less";
import alertikon from "../../Hovedside/infomation-circle-2.svg";
import { Element } from "nav-frontend-typografi";

import Lenke from "nav-frontend-lenker";
import { basename } from "../../../paths";

export const TilgangsStyringInfoTekst: FunctionComponent = () => {
  return (
    <div className={"informasjonsboks"}>
      <img
        src={alertikon}
        alt={"ikon for å vise at det kommer informasjon om tilgangsstyring"}
        className={"informasjonsboks__ikon"}
      />
      <div className={"informasjonsboks__tekst"}>
        <Element className={"informasjonsboks__overskrift"}>
          Tjenestene er tilgangsstyrt gjennom Altinn{" "}
        </Element>
        Tjenesten er tilgangsstyrt og baserer seg på roller registrert av din
        virksomhet i Altinn. Ulike roller gir tilgang til ulike tjenester.
        <br />
        <br />
        <Lenke
          className={"informasjonsboks__lenke"}
          href={basename + "/informasjon-om-tilgangsstyring"}
        >
          Les mer om hvordan du får tilgang.
        </Lenke>
      </div>
    </div>
  );
};
