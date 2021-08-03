import React, {useEffect} from 'react';
import {UndertekstBold} from 'nav-frontend-typografi';
import {datotekst} from '../dato-funksjoner';
import VarselpanelIkonBeskjed from './varselpanel-ikon-beskjed';
import './NotifikasjonListeElement.less';
import {Notifikasjon, OppgaveTilstand} from "../../../../../api/graphql-types";
import VarselpanelIkonOppgave from './varselpanel-ikon-oppgave';
import VarselpanelIkonOppgaveUtfoert from "./varselpanel-ikon-oppgave-utfoert";
import { HoyreChevron } from 'nav-frontend-chevron';

interface Props {
    varsel: Notifikasjon;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
    indeks: number;
    antallVarsler: number;
    setErApen: (bool: boolean) => void;
    onKlikketPaaLenke: (varsel: Notifikasjon) => void;
}

const onArrowpress = (key: string, props: Props) => {
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

export const NotifikasjonListeElement = (props: Props) => {
    useEffect(() => {
        if (props.indeks === props.indeksVarselIFokus) {
            const element = document.getElementById('varsel-lenkepanel-indeks-' + props.indeks);
            element?.focus();
        }
    }, [props.indeks, props.indeksVarselIFokus]);

    const varsel = props.varsel;

    const date = new Date(varsel.opprettetTidspunkt)

    let ikon;
    switch (props.varsel.__typename) {
        case "Beskjed":
            ikon = <VarselpanelIkonBeskjed/>;
            break;
        case "Oppgave":
            ikon = props.varsel.tilstand == OppgaveTilstand.Utfoert
                ? <VarselpanelIkonOppgaveUtfoert/>
                : <VarselpanelIkonOppgave/>;
            break;
        default:
            console.error(`ukjent notifikasjonstype ${props.varsel.__typename}: ignorerer`)
            return null;
    }

    const erUtfoert = varsel.__typename == "Oppgave" && varsel.tilstand == OppgaveTilstand.Utfoert;
    return <div className="notifikasjon_liste_element">
        <div className="notifikasjon_liste_element-metadata">
            <div className="notifikasjon_liste_element-metadata-dato">
                { erUtfoert ? <strong>'Utført '</strong> : null } { datotekst(date, !erUtfoert) }
            </div>

            <UndertekstBold className="notifikasjon_liste_element-metadata-merkelapp">
                {varsel.merkelapp}
            </UndertekstBold>
        </div>

        <div className="notifikasjon_liste_element-virksomhetsnavn">
            {varsel.virksomhet.navn.toUpperCase()}
        </div>

        <div
            className="notifikasjon_liste_element-lenkepanel"
            // onClick={() => {
            //     props.onKlikketPaaLenke(varsel)
            // }}
            //onKeyDown={(event) => onArrowpress(event.key, props)}
            //href={varsel.lenke}
            //tittelProps="normaltekst"
            aria-label=""
            id={'varsel-lenkepanel-indeks-' + props.indeks}
        >
            <div className="notifikasjon_liste_element-lenkepanel-ikon"> {ikon} </div>
            <div className="notifikasjon_liste_element-lenkepanel-tekst">
                <span className={
                    varsel.brukerKlikk?.klikketPaa
                        ? 'varsel-beskjed varsel-beskjed--lest'
                        : 'varsel-beskjed varsel-beskjed--ulest'
                }
                >
                    {varsel.tekst}
                </span>
            </div>
            <div className="notifikasjon_liste_element-lenkepanel-chevron">
                <HoyreChevron/>
            </div>
        </div>
    </div>;
};
