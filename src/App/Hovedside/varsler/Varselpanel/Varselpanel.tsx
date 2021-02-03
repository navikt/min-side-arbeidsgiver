import React, { useContext, useEffect } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Varsel } from '../../../../api/varslerApi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { VarselLenkepanel } from './VarselLenkepanel/VarselLenkepanel';
import './Varselpanel.less';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    setIndeksVarselIFokus: (indeks: number) => void;
    indeksVarselIFokus: number;
}

const Varselpanel = ({ erApen, setErApen, indeksVarselIFokus, setIndeksVarselIFokus }: Props) => {
    const { varsler } = useContext(OrganisasjonsDetaljerContext);

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

        >
            <Undertittel className="varselpanel-overskrift">
                Beskjeder og oppgaver
            </Undertittel>

            <div className="varselpanel-elementer-wrapper" role="toolbar">
                <div id="varselpanel-elementer" className="varselpanel-elementer">
                    <ul
                        className="varselpanel-elementer__varsler-liste"
                        aria-label={`Liste med ${varsler?.length} beskjeder`}
                    >
                        {varsler?.map((varsel: Varsel, index: number) => (
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
                </div>
            </div>
        </menu>
    );
};

export default Varselpanel;
