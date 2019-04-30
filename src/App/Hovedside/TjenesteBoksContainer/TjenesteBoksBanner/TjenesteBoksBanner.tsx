import React, { FunctionComponent } from "react";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import "./TjenesteBoksBanner.less";

interface Props {
  className?: string;
  imgsource: string;
  tittel: string;
}

const TjenesteBoksBanner: FunctionComponent<Props> = props => {
  return (
    <div className={"tjeneste-boks-banner"}>
      <img className={"tjeneste-boks-banner__ikon"} src={props.imgsource} />
      <Undertittel className={"tjeneste-boks-banner__tittel"}>
        {props.tittel}
      </Undertittel>
    </div>
  );
};

export default TjenesteBoksBanner;
