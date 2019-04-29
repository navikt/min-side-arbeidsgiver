import React, { FunctionComponent } from "react";
import "./Tjenesteboks.less";
import Undertittel from "nav-frontend-typografi/lib/undertittel";

interface Props {
  className?: string;
  imgsource: string;
  tittel: string;
}

const TjenesteBoksBanner: FunctionComponent<Props> = props => {
  return (
    <div className={"tjeneste-boks-banner"}>
      <img className={"tjeneste-boks-banner__ikon"} src="imgsource" />
      <Undertittel className={"tjeneste-boks-banner__tittel"}>
        {props.tittel}
      </Undertittel>
    </div>
  );
};

export default TjenesteBoksBanner;
