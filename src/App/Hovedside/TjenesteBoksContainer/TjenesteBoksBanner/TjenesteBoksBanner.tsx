import React, { FunctionComponent } from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
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
          <Undertittel>
            {props.antallVarsler}
            {console.log("render antallvarsler for ", props.tittel)}
          </Undertittel>
        </span>
      )}
    </div>
  );
};

export default TjenesteBoksBanner;
