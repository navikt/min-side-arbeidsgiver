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
    dropdownouterheight: number;
    dropdowninnerheight: number;
}

const Varselpanel = ({
    erApen,
    setErApen,
    indeksVarselIFokus,
    setIndeksVarselIFokus,
    dropdownouterheight,
    dropdowninnerheight,
}: Props) => {
    const { varsler } = useContext(OrganisasjonsDetaljerContext);

    useEffect(() => {
        if (erApen) {
            const containerElement = document.getElementById('varselpanel-elementer');
            containerElement?.scrollTo(0, 0);
        }
    }, [erApen]);

    const sorterDato = (dato1: Varsel, dato2: Varsel) => {
        return dato1.dato > dato2.dato ? -1 : dato1.dato < dato2.dato ? 1 : 0;
    };

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
                            {varsler?.sort(sorterDato).map((varsel: Varsel, index: number) => (
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
