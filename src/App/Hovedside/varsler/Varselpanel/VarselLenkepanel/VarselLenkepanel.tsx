import React, { RefObject, useEffect, useState } from "react";
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
}

export const VarselLenkepanel = (props: Props) => {
  const [erIFokus, setErIFokus] = useState(false);

  const refTilElement = React.createRef<HTMLButtonElement>()

  useEffect(() => {
    if (props.indeks === props.indeksVarselIFokus) {
      console.log('dette skjer med indeks: ', props.indeks)
      refTilElement?.current?.focus()
    }
  }, [props.indeks, props.indeksVarselIFokus]);

  return (
    <button ref={refTilElement}>
    <Lenkepanel
      href={props.varsel.href}
      tittelProps="normaltekst"
      aria-label=""
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
      </button>
  );
};
