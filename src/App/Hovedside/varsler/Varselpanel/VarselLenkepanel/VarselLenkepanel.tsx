import React, {useEffect} from 'react';
import {UndertekstBold} from 'nav-frontend-typografi';
import Lenkepanel from 'nav-frontend-lenkepanel';
import {datotekst} from '../dato-funksjoner';
import VarselpanelIkonBeskjed from './varselpanel-ikon-beskjed';
import VarselpanelIkonOppgave from './varselpanel-ikon-oppgave';
import './VarselLenkepanel.less';
import {Beskjed} from "../../../../../api/graphql-types";

interface Props {
    varsel: Beskjed;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
    indeks: number;
    antallVarsler: number;
    setErApen: (bool: boolean) => void;
    onKlikketPaaLenke?: (varsel: Beskjed) => void;
}

export const VarselLenkepanel = (
    {
        onKlikketPaaLenke = () => {
        },
        ...props
    }: Props
) => {
    useEffect(() => {
        if (props.indeks === props.indeksVarselIFokus) {
            const element = document.getElementById('varsel-lenkepanel-indeks-' + props.indeks);
            element?.focus();
        }
    }, [props.indeks, props.indeksVarselIFokus]);

    const onArrowpress = (key: string) => {
        if (key === 'Tab' && props.indeks === props.antallVarsler - 1) {
            props.setErApen(false);
        }
        if (key === 'Escape' || key === 'Esc') {
            props.setErApen(false);
        }
        if (key === 'ArrowUp' || key === 'Up') {
            if (props.indeks === 0) {
                props.setIndeksVarselIFokus(props.antallVarsler - 1);
            } else {
                props.setIndeksVarselIFokus(props.indeks - 1);
            }
        }
        if (key === 'ArrowDown' || key === 'Down') {
            if (props.indeks === props.antallVarsler - 1) {
                props.setIndeksVarselIFokus(0);
            } else {
                props.setIndeksVarselIFokus(props.indeks + 1);
            }
        }
    };
    const date = new Date(props.varsel.opprettetTidspunkt)
    return (
        <Lenkepanel
            className="varselpanel__lenkepanel"
            onClick={() => {
                onKlikketPaaLenke(props.varsel)
            }}
            onKeyDown={(event) => onArrowpress(event.key)}
            href={props.varsel.lenke}
            tittelProps="normaltekst"
            aria-label=""
            id={'varsel-lenkepanel-indeks-' + props.indeks}
        >
            <div className="varsel-innhold">
                <div className="varsel-dato-type">
                    <div className="varsel-dato">{datotekst(date)}</div>
                    <UndertekstBold className="varsel-type">{props.varsel.merkelapp}</UndertekstBold>
                </div>
                <div className="varsel-lenketekst">
                    <div className="varsel-ikon">
                        {/*props.varsel.varseltype === Varseltype.BESKJED ? ( */
                            <VarselpanelIkonBeskjed/>
                            /*) : (
                                <VarselpanelIkonOppgave />
                            )*/
                        }
                    </div>
                    <span
                        className={/*props.varsel.lest ? 'varsel-beskjed--lest' :*/ 'varsel-beskjed--ulest'}>{props.varsel.tekst}</span>
                </div>
            </div>
        </Lenkepanel>
    );
};
