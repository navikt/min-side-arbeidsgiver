import React, {LegacyRef, useEffect, useRef} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import { Xknapp } from "nav-frontend-ikonknapper";
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
    const ref = useRef<HTMLDivElement>(null)
    const focusXKnapp = () => {
        // TODO: virker ikke...
        console.log("focus", { curr: ref.current, el: ref.current?.querySelector<HTMLButtonElement>(".notifikasjon_liste-header button")})
        ref.current?.querySelector<HTMLButtonElement>(".notifikasjon_liste-header button")?.focus()
    }

    const [notifikasjonKlikketPaa] = useMutation(NOTIFIKASJONER_KLIKKET_PAA);

    return (
        <div ref={ref} role="presentation" onKeyDown={({ key } ) => {
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
                    <Xknapp htmlType="button" onClick={() => setErApen(false)}/>
                </div>

                <ul
                    role="feed"
                    id="notifikasjon_liste-elementer"
                    className="notifikasjon_liste-elementer"
                >
                    { notifikasjoner?.map((varsel: Notifikasjon, index: number) => (
                        <li key={index} role="article">
                            <NotifikasjonListeElement
                                setErApen={setErApen}
                                antall={notifikasjoner?.length}
                                indeks={index}
                                indeksIFokus={indeksIFokus}
                                setIndeksIFokus={setIndeksIFokus}
                                onKlikketPaaLenke={(notifikasjon) => {
                                    // noinspection JSIgnoredPromiseFromCall sentry håndterer unhandled promise rejections
                                    notifikasjonKlikketPaa({variables: {id: notifikasjon.id}})
                                }}
                                notifikasjon={varsel}
                                onTabbetUt={focusXKnapp}
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
