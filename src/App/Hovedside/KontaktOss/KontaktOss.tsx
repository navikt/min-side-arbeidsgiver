import React, { FunctionComponent } from "react";
import { Undertittel } from "nav-frontend-typografi";
import Innholdsboks from "../Innholdsboks/Innholdsboks";
import Chevron from "nav-frontend-chevron";
import iconKontaktNav from "../iconSykemeldte.svg";
import "./KontaktOss.less";
import Lenkepanel from "nav-frontend-lenkepanel";

const KontaktOss: FunctionComponent = () => {
  return (
    <Lenkepanel
      className={"lenkepanelKontaktOss"}
      href={"https://arbeidsgiver.nav.no/kontakt-oss/"}
      tittelProps={"undertittel"}
    >
      <div className={"kontaktNAV"}>
        <img className={"kontaktNAV__ikonKontakNAV"} src={iconKontaktNav} />
        <Undertittel className={"kontaktNAV__tekst"}>
          Kom i kontakt med NAV
        </Undertittel>
      </div>
    </Lenkepanel>
  );
};

export default KontaktOss;
