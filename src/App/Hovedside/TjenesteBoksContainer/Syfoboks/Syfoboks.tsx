import React, { FunctionComponent, useContext } from "react";
import syfoikon from "./syfoikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import "./Syfoboks.less";
import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";
import { SyfoTilgangContext } from "../../../../SyfoTilgangProvider";
import { SyfoOppgave } from "../../../../syfoOppgaver";

interface Props {
  varseltekst?: string;
  className?: string;
}

const tellTypeOppgaver = (oppgaveArray:SyfoOppgave[], oppgaveType:string):number => {
  return oppgaveArray.filter(oppgave => {
    return oppgave.oppgavetype===  oppgaveType}).length;
};

const leggTilErHvisFlertall = (antall:number, substantiv:string):string=>{
  if(antall === 1 ){
    return substantiv;
  }
  return substantiv + "er";
};


const Syfoboks: FunctionComponent<Props> = props => {
  const { syfoOppgaverState } = useContext(SyfoTilgangContext);
  const { syfoAnsatteState } = useContext(SyfoTilgangContext);

  const tooltipText:FunctionComponent<Props>=()=>{
    const antallSykemeldingsvarsler =tellTypeOppgaver(syfoOppgaverState,"Sykemelding");
    const antallSoknadsVarsler = tellTypeOppgaver(syfoOppgaverState,"Sykepengesøknad");

    return<div>
      <div>{antallSykemeldingsvarsler} uleste {leggTilErHvisFlertall(antallSykemeldingsvarsler,"sykmelding")}.</div>
      <div>{antallSoknadsVarsler} {leggTilErHvisFlertall(antallSoknadsVarsler,"sykepengesøknad")} som ikke er lest, eller sendt inn.</div>
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
