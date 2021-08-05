import React, {useEffect} from 'react';
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
    setIndeksIFokus: (indeks: number) => void;
    indeksIFokus: number;
    notifikasjoner: Notifikasjon[] | undefined;
}

const NotifikasjonListe = ({
                               notifikasjoner,
                               erApen,
                               setErApen,
                               indeksIFokus,
                               setIndeksIFokus,
                           }: Props) => {

    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('notifikasjon_liste-elementer');
            containerElement?.scrollTo(0, 0);
        }
    }, [erApen]);
    useEffect(() => {
        if (indeksIFokus === -1) {
            const element = document.getElementById('notifikasjon_liste-header-xbtn');
            element?.focus();
        }
    }, [indeksIFokus]);
    const [notifikasjonKlikketPaa] = useMutation(NOTIFIKASJONER_KLIKKET_PAA);
    const lukk = () => {
        setErApen(false);
        setIndeksIFokus(-1)
    }

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
                                if (event.key === 'Tab') {
                                    if (event.shiftKey) {
                                        lukk();
                                    } else {
                                        setIndeksIFokus(0);
                                    }
                                }
                            }}
                            onClick={() => {
                                lukk();
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
                                indeksIFokus={indeksIFokus}
                                setIndeksIFokus={setIndeksIFokus}
                                onKlikketPaaLenke={(notifikasjon) => {
                                    // noinspection JSIgnoredPromiseFromCall sentry håndterer unhandled promise rejections
                                    notifikasjonKlikketPaa({variables: {id: notifikasjon.id}})
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
