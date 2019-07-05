import React, { FunctionComponent } from "react";
import { Element, Undertittel } from "nav-frontend-typografi";
import "./TjenesteBoksBanner.less";

interface Props {
  className?: string;
  imgsource: string;
  tittel: string;
  altTekst: string;
  antallVarsler?: number;
}

const TjenesteBoksBanner: FunctionComponent<Props> = props => {
  return (
    <div className={"tjeneste-boks-banner"}>
      <img
        className={"tjeneste-boks-banner__ikon"}
        src={props.imgsource}
        alt={props.altTekst}
      />
      <Undertittel className={"tjeneste-boks-banner__tittel"}>
        {props.tittel}
      </Undertittel>
      {props.antallVarsler! > 0 && (
        <span className={"tjeneste-boks-banner__varselsirkel"}>
          <Element className={"tjeneste-boks-banner__varsel"}>
            {props.antallVarsler}
          </Element>
        </span>
      )}
    </div>
  );
};

export default TjenesteBoksBanner;
