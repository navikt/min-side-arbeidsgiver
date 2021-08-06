import React, {useEffect, useState} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import { Close } from '@navikt/ds-icons'
import {NotifikasjonListeElement} from './NotifikasjonListeElement/NotifikasjonListeElement';
import './NotifikasjonPanel.less';
import {Notifikasjon} from "../../../../api/graphql-types";
import {useMutation} from "@apollo/client";
import {NOTIFIKASJONER_KLIKKET_PAA} from "../../../../api/graphql";

interface Props {
    erApen: boolean;
    lukkPanel: () => void;
    notifikasjoner: Notifikasjon[] | undefined;
}

const NotifikasjonPanel = ({
                               notifikasjoner,
                               erApen,
                               lukkPanel,
                           }: Props) => {
    
    const [valgtNotifikasjon, setValgtNotifikasjon] = useState(0);
    const [xbtnIFocus, setXbtnIFocus] = useState(false);
    
    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('notifikasjon_panel-liste');
            containerElement?.scrollTo(0, 0);
        }
    }, [erApen]);

    useEffect(() => {
        if (!erApen) {
            return;
        }
        if (xbtnIFocus) {
            const element = document.getElementById('notifikasjon_panel-header-xbtn');
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
                lukkPanel();
            }
        }}>
            <div
                id="notifikasjon_panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="notifikasjon_panel-header"
                className={`notifikasjon_panel ${erApen ? 'notifikasjon_panel--apen' : ''}`}
            >
                <div id="notifikasjon_panel-header" className="notifikasjon_panel-header">
                    <Undertittel>Beskjeder og oppgaver</Undertittel>
                    <button id="notifikasjon_panel-header-xbtn"
                            className="notifikasjon_panel-header-xbtn"
                            onKeyDown={(event) => {
                                // på sikt håndtere navigasjon basert på om footer er tabbable eller ikke
                                if (event.key === 'Tab') {
                                    setXbtnIFocus(false);
                                }
                            }}
                            onClick={() => {
                                lukkPanel();
                            }}>
                        <Close/>
                    </button>
                </div>

                <ul
                    role="feed"
                    id="notifikasjon_panel-liste"
                    className="notifikasjon_panel-liste"
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

                <div className="notifikasjon_panel-footer">
                    <Undertittel>Footer</Undertittel>
                </div>
            </div>
        </div>
    );
};

export default NotifikasjonPanel;
