import React, { FunctionComponent } from "react";
import "./AltinnBoks.less";

import AltinnBoksMedTilgang from "./AltinnBokser/AltinnBoksMedTilgang";
import AltinnBoksUtenTilgang from "./AltinnBokser/AltinnBoksUtenTilgang";

interface Props {
  riktigRolle: boolean;
}

const AltinnBoks: FunctionComponent<Props> = props => {
  if (props.riktigRolle) {
    return <AltinnBoksMedTilgang />;
  }
  return <AltinnBoksUtenTilgang />;
};

export default AltinnBoks;
