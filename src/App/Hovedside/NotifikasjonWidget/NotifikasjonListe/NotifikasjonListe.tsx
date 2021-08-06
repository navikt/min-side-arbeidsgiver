import React, {useEffect, useState} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import { Close } from '@navikt/ds-icons'
import {NotifikasjonListeElement} from './NotifikasjonListeElement/NotifikasjonListeElement';
import './NotifikasjonListe.less';
import {Notifikasjon} from "../../../../api/graphql-types";
import {useMutation} from "@apollo/client";
import {NOTIFIKASJONER_KLIKKET_PAA} from "../../../../api/graphql";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    notifikasjoner: Notifikasjon[] | undefined;
}

const NotifikasjonListe = ({
                               notifikasjoner,
                               erApen,
                               setErApen,
                           }: Props) => {
    
    const [valgtNotifikasjon, setValgtNotifikasjon] = useState(0);
    const [xbtnIFocus, setXbtnIFocus] = useState(false);
    
    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('notifikasjon_liste-elementer');
            containerElement?.scrollTo(0, 0);
        }
    }, [erApen]);

    useEffect(() => {
        if (!erApen) {
            return;
        }
        if (xbtnIFocus) {
            const element = document.getElementById('notifikasjon_liste-header-xbtn');
            element?.focus();
        } else {
            const element = document.getElementById('notifikasjon_liste_element-indeks-' + valgtNotifikasjon);
            element?.focus();
        }
    }, [xbtnIFocus, erApen, valgtNotifikasjon]);
    const [notifikasjonKlikketPaa] = useMutation(NOTIFIKASJONER_KLIKKET_PAA);

    return (
        <div role="presentation" onKeyDown={({key}) => {
            if (key === 'Escape' || key === 'Esc') {
                setErApen(false);
            }
        }}>
            <div
                id="notifikasjon_liste"
                role="dialog"
                aria-modal="true"
                aria-owns="notifikasjon_liste"
                aria-labelledby="notifikasjon_liste-header"
                className={`notifikasjon_liste ${erApen ? 'notifikasjon_liste--apen' : ''}`}
            >
                <div id="notifikasjon_liste-header" className="notifikasjon_liste-header">
                    <Undertittel>Beskjeder og oppgaver</Undertittel>
                    <button id="notifikasjon_liste-header-xbtn"
                            className="notifikasjon_liste-header-xbtn"
                            onKeyDown={(event) => {
                                // på sikt håndtere navigasjon basert på om footer er tabbable eller ikke
                                if (event.key === 'Tab') {
                                    setXbtnIFocus(false);
                                }
                            }}
                            onClick={() => {
                                setErApen(false);
                            }}>
                        <Close/>
                    </button>
                </div>

                <ul
                    role="feed"
                    id="notifikasjon_liste-elementer"
                    className="notifikasjon_liste-elementer"
                >
                    {notifikasjoner?.map((varsel: Notifikasjon, index: number) => (
                        <li key={index} role="article">

                            <NotifikasjonListeElement
                                antall={notifikasjoner?.length}
                                indeks={index}
                                erValgt={index === valgtNotifikasjon}
                                gåTilForrige={() => setValgtNotifikasjon(Math.max(0, index - 1))}
                                gåTilNeste={() => setValgtNotifikasjon(Math.min(index + 1, notifikasjoner?.length - 1))}
                                onKlikketPaaLenke={(notifikasjon) => {
                                    // noinspection JSIgnoredPromiseFromCall sentry håndterer unhandled promise rejections
                                    notifikasjonKlikketPaa({variables: {id: notifikasjon.id}});
                                    setValgtNotifikasjon(index);
                                }}
                                onTabEvent={(_shift) => {
                                    // på sikt håndtere navigasjon basert på om footer er tabbable eller ikke
                                    setXbtnIFocus(true);
                                }}
                                notifikasjon={varsel}
                            />
                        </li>
                    ))
                    }
                </ul>

                <div className="notifikasjon_liste-footer">
                    <Undertittel>Footer</Undertittel>
                </div>
            </div>
        </div>
    );
};

export default NotifikasjonListe;
