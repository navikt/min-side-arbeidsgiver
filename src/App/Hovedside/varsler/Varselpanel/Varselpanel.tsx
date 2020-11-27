import React, { useContext } from 'react';
import Lukknapp from 'nav-frontend-lukknapp';
import { Undertittel } from 'nav-frontend-typografi';
import { Varsel } from '../../../../api/varslerApi';

import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Varselpanel.less';
import { VarselLenkepanel } from "./VarselLenkepanel/VarselLenkepanel";

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

const Varselpanel = ({ erApen, setErApen }: Props) => {
    const { varsler } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div
            className={`varselpanel varselpanel__dropdown--${erApen ? 'apen' : 'lukket'}`}
            id="varsler-dropdown"
        >
            <div className="varselpanel-elementer-wrapper">
                <div className="varselpanel-elementer">
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
                                <VarselLenkepanel varsel={varsel}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Varselpanel;