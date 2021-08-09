import React, { useEffect, useState } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Close } from '@navikt/ds-icons'
import { NotifikasjonListeElement } from './NotifikasjonListeElement/NotifikasjonListeElement';
import './NotifikasjonPanel.less';
import { Notifikasjon } from '../../../../api/graphql-types';
import { useMutation } from '@apollo/client';
import { NOTIFIKASJONER_KLIKKET_PAA } from '../../../../api/graphql';
import { NotifikasjonInformasjon } from './NotifikasjonInformasjon/NotifikasjonInformasjon';

interface Props {
    erApen: boolean;
    onLukkPanel: () => void;
    notifikasjoner: Notifikasjon[] | undefined;
}

const NotifikasjonPanel = (
    {
        notifikasjoner,
        erApen,
        onLukkPanel,
    }: Props
) => {
    
    const [valgtNotifikasjon, setValgtNotifikasjon] = useState(0);

    const lukkPanel = () => {
        setValgtNotifikasjon(0);
        onLukkPanel();
    }

    const focusXButton = () => {
        document.getElementById('notifikasjon_panel-header-xbtn')?.focus();
    }
    const focusNotifikasjon = () => {
        document.getElementById('notifikasjon_liste_element-indeks-' + valgtNotifikasjon)?.focus();
    }
    const focusMoreInfo = () => {
        document.getElementById('notifikasjon-informasjon-knapp')?.focus();
    }

    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('notifikasjon_panel-liste');
            containerElement?.scrollTo(0, 0);
            focusNotifikasjon()
        }
    }, [erApen]);

    useEffect(() => {
        if (erApen) {
            focusNotifikasjon();
        }
    }, [erApen, valgtNotifikasjon]);

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
                                if (event.key === 'Tab') {
                                    if (event.shiftKey) {
                                        focusMoreInfo()
                                        event.preventDefault();
                                    }
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
                                notifikasjon={varsel}
                            />
                        </li>
                    ))
                    }
                </ul>

                <div className="notifikasjon_panel-footer">
                    <NotifikasjonInformasjon
                        onTabEvent={(shiftKey, event) => {
                            if (!shiftKey) {
                                focusXButton();
                                event.preventDefault();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotifikasjonPanel;
