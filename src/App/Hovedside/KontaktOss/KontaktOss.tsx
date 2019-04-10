import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import iconKontaktNav from "./kontaktossikon.svg";
import "./KontaktOss.less";
import Lenkepanel from "nav-frontend-lenkepanel";

const KontaktOss: FunctionComponent = () => {
  return (
    <Lenkepanel
      className={"kontakt-oss"}
      href={"https://arbeidsgiver.nav.no/kontakt-oss/"}
      tittelProps={"undertittel"}
      linkCreator={(props: any) => (
        <a target="_blank" {...props}>
          {props.children}
        </a>
      )}
    >
      <div className={"kontakt-oss__wrapper"}>
        <img className={"kontakt-oss__ikon"} src={iconKontaktNav} />
        <Undertittel className={"kontakt-oss__tekst"}>
          Kom i kontakt med NAV
        </Undertittel>
      </div>
    </Lenkepanel>
  );
};

export default KontaktOss;
