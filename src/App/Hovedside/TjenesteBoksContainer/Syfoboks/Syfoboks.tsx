import React, { FunctionComponent, useContext } from "react";
import syfoikon from "./syfoikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import "./Syfoboks.less";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";
import { SyfoTilgangContext } from "../../../../SyfoTilgangProvider";

interface Props {
  varseltekst?: string;
  className?: string;
}

const Syfoboks: FunctionComponent<Props> = props => {
  const { syfoOppgaverState } = useContext(SyfoTilgangContext);
  return (
    <div className={"syfoboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Sykemeldte"}
        imgsource={syfoikon}
        altTekst={"En person med brukket hånd som snakker med en annen person"}
        antallVarsler={syfoOppgaverState.length}
      />

      <Lenkepanel
        className={"syfoboks__sykemeldte"}
        href={syfoLink()}
        tittelProps={"normaltekst"}
        linkCreator={(props: any) => <a {...props}>{props.children}</a>}
      >
        6 sykemeldte som du har ansvar for å følge opp
      </Lenkepanel>
    </div>
  );
};

export default Syfoboks;
