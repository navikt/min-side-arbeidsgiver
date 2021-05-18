import React, {useEffect} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import {VarselLenkepanel} from './VarselLenkepanel/VarselLenkepanel';
import './Varselpanel.less';
import {Notifikasjon} from "../../../../api/graphql-types";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
    dropdownouterheight: number;
    dropdowninnerheight: number;
    varsler: Notifikasjon[] | undefined;
}

const Varselpanel = ({
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


    return (
        <menu
            className={`varselpanel varselpanel__dropdown--${erApen ? 'apen' : 'lukket'}`}
            id="varsler-dropdown"
            style={{ maxHeight: dropdownouterheight }}
        >
            <div className="varselpanel-tittel">
                <Undertittel>Beskjeder og oppgaver</Undertittel>
            </div>

            <div className="varselpanel-elementer-wrapper" role="toolbar">
                <div
                    id="varselpanel-elementer"
                    className="varselpanel-elementer"
                    style={{ maxHeight: dropdowninnerheight }}
                >
                    {varsler && varsler.length ?
                        <ul
                            className="varselpanel-elementer__varsler-liste"
                            aria-label={`Liste med ${varsler?.length} beskjeder`}
                        >
                            {varsler?.map((varsel: Notifikasjon, index: number) => (
                                <li key={index}>
                                    <VarselLenkepanel
                                        setErApen={setErApen}
                                        antallVarsler={varsler?.length}
                                        indeks={index}
                                        indeksVarselIFokus={indeksVarselIFokus}
                                        setIndeksVarselIFokus={setIndeksVarselIFokus}
                                        varsel={varsel}
                                    />
                                </li>
                            ))}
                        </ul>
                    : <div className="varselpanel-elementer__ingenvarsler">Ingen nye beskjeder eller oppgaver</div>
                    }
                </div>
            </div>
        </menu>
    );
};

export default Varselpanel;
