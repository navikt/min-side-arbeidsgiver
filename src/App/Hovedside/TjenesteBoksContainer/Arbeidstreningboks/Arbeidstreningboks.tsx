import React, { FunctionComponent } from "react";
import arbeidstreningikon from "./arbeidstreningikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import "./Arbeidstreningboks.less";

import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";

interface Props {
  varseltekst?: string;
  className?: string;
}

const Arbeidstreningboks: FunctionComponent<Props> = props => {
  return (
    <div className={"arbeidstreningboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Arbeidstrening"}
        imgsource={arbeidstreningikon}
        altTekst={"En industriarbeider med hjelm"}
      />

      <Lenkepanel
        className={"arbeidstreningboks__info"}
        href={syfoLink()}
        tittelProps={"normaltekst"}
        linkCreator={(props: any) => <a {...props}>{props.children}</a>}
      >
        8 personer på Arbeidstrening
      </Lenkepanel>
    </div>
  );
};

export default Arbeidstreningboks;
