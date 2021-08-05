import React, {useEffect} from 'react';
import {Undertekst, UndertekstBold} from 'nav-frontend-typografi';
import {datotekst} from '../dato-funksjoner';
import {ReactComponent as IkonBeskjed} from './ikon-beskjed.svg';
import './NotifikasjonListeElement.less';
import {Notifikasjon, OppgaveTilstand} from "../../../../../api/graphql-types";
import {ReactComponent as IkonOppgave} from './ikon-oppgave.svg';
import {ReactComponent as IkonOppgaveUtfoert} from "./ikon-oppgave-utfoert.svg";
import {HoyreChevron} from 'nav-frontend-chevron';

interface Props {
    notifikasjon: Notifikasjon;
    setIndeksIFokus: (indeks: number) => void;
    indeksIFokus: number;
    indeks: number;
    antall: number;
    onKlikketPaaLenke: (notifikasjon: Notifikasjon) => void;
}


export const NotifikasjonListeElement = (props: Props) => {
    useEffect(() => {
        if (props.indeks === props.indeksIFokus) {
            const element = document.getElementById('notifikasjon_liste_element-indeks-' + props.indeks);
            element?.focus();
        }
    }, [props.indeks, props.indeksIFokus]);

    const notifikasjon = props.notifikasjon;

    const date = new Date(notifikasjon.opprettetTidspunkt)

    let ikon;
    switch (props.notifikasjon.__typename) {
        case "Beskjed":
            ikon = <IkonBeskjed/>;
            break;
        case "Oppgave":
            ikon = props.notifikasjon.tilstand == OppgaveTilstand.Utfoert
                ? <IkonOppgaveUtfoert/>
                : <IkonOppgave/>;
            break;
        default:
            console.error(`ukjent notifikasjonstype ${props.notifikasjon.__typename}: ignorerer`)
            return null;
    }

    const erUtfoert = notifikasjon.__typename == "Oppgave" && notifikasjon.tilstand == OppgaveTilstand.Utfoert;
    return (
        <a
            tabIndex={props.indeks === props.indeksIFokus ? 0 : -1}
            href={props.notifikasjon.lenke}
            className="notifikasjon_liste_element"
            id={'notifikasjon_liste_element-indeks-' + props.indeks}
            onKeyDown={(event) => {
                if (event.key === 'Tab') {
                    props.setIndeksIFokus(-1);
                }
                if (event.key === 'ArrowUp' || event.key === 'Up') {
                    if (props.indeks === 0) {
                        props.setIndeksIFokus(props.antall - 1);
                    } else {
                        props.setIndeksIFokus(props.indeks - 1);
                    }
                }
                if (event.key === 'ArrowDown' || event.key === 'Down') {
                    if (props.indeks === props.antall - 1) {
                        props.setIndeksIFokus(0);
                    } else {
                        props.setIndeksIFokus(props.indeks + 1);
                    }
                }
            }}
            onClick={() => {
                props.setIndeksIFokus(props.indeks);
                props.onKlikketPaaLenke(notifikasjon)
            }}
        >
        <div className="notifikasjon_liste_element-metadata">
            <Undertekst className="notifikasjon_liste_element-metadata-dato">
                { notifikasjon.__typename }
                {' '}
                { erUtfoert ? 'utført' : 'sendt' }
                {' '}
                { datotekst(date) }
            </Undertekst>

            <UndertekstBold className="notifikasjon_liste_element-metadata-merkelapp">
                {notifikasjon.merkelapp.toUpperCase()}
            </UndertekstBold>
        </div>

        <Undertekst className="notifikasjon_liste_element-virksomhetsnavn">
            {notifikasjon.virksomhet.navn.toUpperCase()}
        </Undertekst>

        <div className="notifikasjon_liste_element-lenkepanel">
            <div className="notifikasjon_liste_element-lenkepanel-ikon">{ikon}</div>
            <div className="notifikasjon_liste_element-lenkepanel-tekst">
                { notifikasjon.brukerKlikk?.klikketPaa ? notifikasjon.tekst : <strong>{notifikasjon.tekst}</strong> }
            </div>
            <div className="notifikasjon_liste_element-lenkepanel-chevron">
                <HoyreChevron/>
            </div>
        </div>
    </a>);
};
