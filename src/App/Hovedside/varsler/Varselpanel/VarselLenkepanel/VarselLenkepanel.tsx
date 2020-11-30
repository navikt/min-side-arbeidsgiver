import React, { useEffect } from "react";
import './VarselLenkepanel.less';
import { datotekst } from "../dato-funksjoner";
import { Normaltekst } from "nav-frontend-typografi";
import { Varsel, Varseltype } from "../../../../../api/varslerApi";
import VarselpanelIkonBeskjed from "../varselpanel-ikon-beskjed";
import VarselpanelIkonOppgave from "../varselpanel-ikon-oppgave";
import Lenkepanel from "nav-frontend-lenkepanel";

interface Props {
  varsel: Varsel
  setIndeksVarselIFokus: (indeks: number) => void;
  indeksVarselIFokus: number
  indeks: number
  antallVarsler: number;
  setErApen: (bool: boolean) => void;
}

export const VarselLenkepanel = (props: Props) => {

  useEffect(() => {
    if (props.indeks === props.indeksVarselIFokus) {
      const element = document.getElementById('varsel-lenkepanel-indeks-'+props.indeks)
      console.log('dette skjer med indeks: ', props.indeks)
      element?.focus()
    }
  }, [props.indeks, props.indeksVarselIFokus]);

  const onArrowpress = (key: string) => {
    if (key === 'Tab' && props.indeks === props.antallVarsler-1) {
      props.setErApen(false)
    }
    if (key === 'Escape' || key === 'Esc') {
      props.setErApen(false);
    }
    if (key === 'ArrowUp' || key === 'Up') {
      if (props.indeks === 0) {
        props.setIndeksVarselIFokus(props.antallVarsler-1);
      }
      else {
        props.setIndeksVarselIFokus(props.indeks -1);
      }
    }
    if (key === 'ArrowDown' || key === 'Down') {
      if (props.indeks === props.antallVarsler-1) {
        props.setIndeksVarselIFokus(0);
      }
      else {
        props.setIndeksVarselIFokus(props.indeks +1);
      }
    }
  }

  return (
    <Lenkepanel
      onKeyDown={(event => onArrowpress(event.key))}
      tabIndex={0}
      href={props.varsel.href}
      tittelProps="normaltekst"
      aria-label=""
      id={ 'varsel-lenkepanel-indeks-'+props.indeks}
    >
      <div className="varsel-innhold">
        <div className="varsel-dato-type">
          <div className="varsel-dato">
            {datotekst(props.varsel.dato)}
          </div>
          <Normaltekst className="varsel-type">
            {props.varsel.type}
          </Normaltekst>
        </div>
        <div className="varsel-lenketekst">
          <div className="varsel-ikon">
            { props.varsel.varseltype === Varseltype.BESKJED
              ? <VarselpanelIkonBeskjed />
              : <VarselpanelIkonOppgave />
            }
          </div>
          <span>{props.varsel.beskjed}</span>
        </div>
      </div>
    </Lenkepanel>
  );
};