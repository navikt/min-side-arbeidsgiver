import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import Lukknapp from 'nav-frontend-lukknapp';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { Varsel } from '../../../../api/varslerApi';
import InfoIkon from '../../../LoggInn/TilgangsStyringInfoTekst/InfoIkon';
import { datotekst } from './dato-funksjoner';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Varselpanel.less';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

const Varselpanel = ({erApen, setErApen}:Props) => {
    const { varsler } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div
            className={`varselpanel varselpanel__dropdown--${
                erApen ? 'apen' : 'lukket'
            }`}
            id="varsler-dropdown"
        >
            <div className="varselpanel-elementer-wrapper">
                <div className="varselpanel-elementer">
                    <div className="varselpanel__tittel">
                        <Undertittel className="varselpanel-overskrift">Beskjeder og oppgaver</Undertittel>
                        <Lukknapp className="varselpanel-lukknapp" onClick={() => setErApen(!erApen) }>Lukk</Lukknapp>
                    </div>
                    { varsler?.map((varsel: Varsel, index: number) => (
                        <div className="varselpanel__lenke" key={index}>
                            <Lenkepanel
                                href={varsel.href}
                                tittelProps="normaltekst"
                                aria-label=""
                            >
                                <div className="varsel-innhold">
                                    <div className="varsel-dato-type">
                                        <div className="varsel-dato">{datotekst(varsel.dato)}</div>
                                        <Normaltekst className="varsel-type">{varsel.type}</Normaltekst>
                                    </div>
                                    <div className="varsel-lenketekst">
                                        <div className="varsel-ikon"><InfoIkon size="48"/></div>
                                        <span>{varsel.beskjed}</span>
                                    </div>
                                </div>
                            </Lenkepanel>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Varselpanel;
