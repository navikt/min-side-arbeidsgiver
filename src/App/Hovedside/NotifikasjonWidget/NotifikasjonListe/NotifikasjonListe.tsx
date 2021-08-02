import React, {useEffect} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import {NotifikasjonListeElement} from './NotifikasjonListeElement/NotifikasjonListeElement';
import './NotifikasjonListe.less';
import {Notifikasjon} from "../../../../api/graphql-types";
import {useMutation} from "@apollo/client";
import {NOTIFIKASJONER_KLIKKET_PAA} from "../../../../api/graphql";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
    dropdownouterheight: number;
    dropdowninnerheight: number;
    varsler: Notifikasjon[] | undefined;
}

const NotifikasjonListe = ({
                               varsler,
                               erApen,
                               setErApen,
                               indeksVarselIFokus,
                               setIndeksVarselIFokus,
                               dropdownouterheight,
                               dropdowninnerheight,
                           }: Props) => {

    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('varselpanel-elementer');
            containerElement?.scrollTo(0, 0);
        }
    }, [erApen]);

    const [notifikasjonKlikketPaa] = useMutation(NOTIFIKASJONER_KLIKKET_PAA);

    return (
        <div
            className={`varselpanel varselpanel__dropdown--${erApen ? 'apen' : 'lukket'}`}
            id="varsler-dropdown"
        >
            <div className="varselpanel-tittel">
                <Undertittel>Beskjeder og oppgaver</Undertittel>
            </div>

            <ul
                role="feed"
                id="varselpanel-elementer"
                className="varselpanel-elementer varselpanel-elementer__varsler-liste"
                aria-label={`Liste med ${varsler?.length} beskjeder`}
                style={{ maxHeight: "70vh" }}
            >
                { varsler?.map((varsel: Notifikasjon, index: number) => (
                    <li key={index}>
                        <NotifikasjonListeElement
                            setErApen={setErApen}
                            antallVarsler={varsler?.length}
                            indeks={index}
                            indeksVarselIFokus={indeksVarselIFokus}
                            setIndeksVarselIFokus={setIndeksVarselIFokus}
                            onKlikketPaaLenke={(notifikasjon) => {
                                // noinspection JSIgnoredPromiseFromCall sentry håndterer unhandled promise rejections
                                notifikasjonKlikketPaa({variables: {id: notifikasjon.id}})
                            }}
                            varsel={varsel}
                        />
                    </li>
                ))
                }
            </ul>

            <div className="varselpanel-tittel">
                <Undertittel>Footer</Undertittel>
            </div>
        </div>
    );
};

export default NotifikasjonListe;
