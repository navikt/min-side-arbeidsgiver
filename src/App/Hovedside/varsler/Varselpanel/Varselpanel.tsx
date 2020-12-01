import React, { useContext, useEffect } from "react";
import Lukknapp from 'nav-frontend-lukknapp';
import { Undertittel } from 'nav-frontend-typografi';
import { Varsel } from '../../../../api/varslerApi';

import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Varselpanel.less';
import { VarselLenkepanel } from "./VarselLenkepanel/VarselLenkepanel";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number
}

const Varselpanel = ({ erApen, setErApen, indeksVarselIFokus, setIndeksVarselIFokus }: Props) => {
    const { varsler } = useContext(OrganisasjonsDetaljerContext);

    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById("varselpanel-elementer");
            containerElement?.scrollTo(0,0)
        }
    },[erApen])

    return (
        <menu
            className={`varselpanel varselpanel__dropdown--${erApen ? 'apen' : 'lukket'}`}
            id="varsler-dropdown"
            role={'toolbar'}
        >
            <div className="varselpanel-elementer-wrapper">
                <div id = {"varselpanel-elementer"} className="varselpanel-elementer">
                    <div className="varselpanel__tittel">
                        <Undertittel className="varselpanel-overskrift">
                            Beskjeder og oppgaver
                        </Undertittel>
                        <Lukknapp
                            className="varselpanel-lukknapp"
                            onClick={() => setErApen(!erApen)}
                        >
                            Lukk
                        </Lukknapp>
                    </div>
                    <ul className="varselpanel__varsler" aria-label={`Liste med ${varsler?.length} beskjeder`}>
                        {varsler?.map((varsel: Varsel, index: number) => (
                            <li className="varselpanel__lenke" key={index}>
                                <VarselLenkepanel setErApen={setErApen}antallVarsler={varsler?.length} indeks={index} indeksVarselIFokus={indeksVarselIFokus} setIndeksVarselIFokus={setIndeksVarselIFokus} varsel={varsel}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </menu>
    );
};

export default Varselpanel;