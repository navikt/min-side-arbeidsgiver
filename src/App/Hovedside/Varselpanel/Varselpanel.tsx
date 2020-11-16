import React from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import Lukknapp from 'nav-frontend-lukknapp';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
// import VarselpanelIkon from './varselpanel-ikon';
import './Varselpanel.less';
import InfoIkon from '../../LoggInn/TilgangsStyringInfoTekst/InfoIkon';
import { datotekst, Varsel, varsler } from './dato-funksjoner';

const Varselpanel = () => {
    return (
        <div className="varselpanel">
            <div className="varselpanel__tittel">
                <Undertittel className="varselpanel-overskrift">Beskjeder og oppgaver</Undertittel>
                <Lukknapp className="varselpanel-lukknapp">Lukk</Lukknapp>
            </div>
            { varsler.map((varsel: Varsel) => (
                <div className="varselpanel__lenke">
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
    );
};

export default Varselpanel;
