import React, { FunctionComponent, useContext } from "react";
import syfoikon from "./syfoikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import "./Syfoboks.less";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";
import { SyfoTilgangContext } from "../../../../SyfoTilgangProvider";
import { SyfoOppgave } from "../../../../Objekter/syfoOppgaver";

interface Props {
    varseltekst?: string;
    className?: string;
}

const tellTypeOppgaver = (oppgaveArray:SyfoOppgave[], oppgaveType:string):number => {
  return oppgaveArray.filter(oppgave => {
    return oppgave.oppgavetype===  oppgaveType}).length;
};

const LagSykepengesoknadVarselTekst = (antall:number):string=>{
  if(antall===1){
    return antall + " sykepenegsøknad som er ulest eller ikke sendt inn"
  }
  if(antall > 1){
    return antall + " sykepengesøknader som er uleste eller ikke sendt inn"
  }
  return "";
};

const LagSykemeldingsVarselTekst = (antall:number):string=>{
  if(antall===1){
    return antall + " ulest sykemelding"
  }
  if(antall > 1){
    return antall + " uleste sykemeldinger"
  }
  return "";
};


const Syfoboks: FunctionComponent<Props> = props => {
  const { syfoOppgaverState } = useContext(SyfoTilgangContext);
  const { syfoAnsatteState } = useContext(SyfoTilgangContext);

  const tooltipText:FunctionComponent<Props>=()=>{
    const antallSykemeldingsvarsler =tellTypeOppgaver(syfoOppgaverState,"Sykemelding");
    const antallSoknadsVarsler = tellTypeOppgaver(syfoOppgaverState,"Sykepengesøknad");

    return<div>
      <div>{LagSykemeldingsVarselTekst(antallSykemeldingsvarsler)}</div>
      <div>{LagSykepengesoknadVarselTekst(antallSoknadsVarsler)}</div>
    </div>
  };

  return (
    <div className={"syfoboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Sykemeldte"}
        imgsource={syfoikon}
        altTekst={""}
        antallVarsler={syfoOppgaverState.length}
        toolTipext={tooltipText}
      />
      <Lenkepanel
        className={"syfoboks__sykemeldte"}
        href={syfoLink()}
        tittelProps={"normaltekst"}
        linkCreator={(props: any) => <a {...props}>{props.children}</a>}
      >
        {syfoAnsatteState} sykemeldte som du har ansvar for å følge opp
      </Lenkepanel>
    </div>
  );
};

export default Syfoboks;
