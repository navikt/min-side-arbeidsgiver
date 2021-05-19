import React, {useEffect} from 'react';
import {UndertekstBold} from 'nav-frontend-typografi';
import Lenkepanel from 'nav-frontend-lenkepanel';
import {datotekst} from '../dato-funksjoner';
import VarselpanelIkonBeskjed from './varselpanel-ikon-beskjed';
import './VarselLenkepanel.less';
import {Beskjed, Notifikasjon} from "../../../../../api/graphql-types";

interface Props {
    varsel: Notifikasjon;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
    indeks: number;
    antallVarsler: number;
    setErApen: (bool: boolean) => void;
    onKlikketPaaLenke: (varsel: Beskjed) => void;
}

export const VarselLenkepanel = (
    {
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

    const varsel = props.varsel;
    if (varsel.__typename !== "Beskjed") {
        return null;
    }

    const date = new Date(varsel.opprettetTidspunkt)
    return (
        <Lenkepanel
            className="varselpanel__lenkepanel"
            onClick={() => {
                props.onKlikketPaaLenke(varsel)
            }}
            onKeyDown={(event) => onArrowpress(event.key)}
            href={varsel.lenke}
            tittelProps="normaltekst"
            aria-label=""
            id={'varsel-lenkepanel-indeks-' + props.indeks}
        >
            <div className="varsel-innhold">
                <div className="varsel-dato-type">
                    <div className="varsel-dato">{datotekst(date)}</div>
                    <UndertekstBold className="varsel-type">{varsel.merkelapp}</UndertekstBold>
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
                        className={varsel.brukerKlikk.klikketPaa ? 'varsel-beskjed--lest' : 'varsel-beskjed--ulest'}>{varsel.tekst}</span>
                </div>
            </div>
        </Lenkepanel>
    );
};
