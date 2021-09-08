import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import iconKontaktNav from './kontaktossikon.svg';
import './KontaktOss.less';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const KontaktOss = () => {
    return (
        <LenkepanelMedLogging
            className="kontakt-oss"
            href="https://arbeidsgiver.nav.no/kontakt-oss/"
            loggLenketekst="kontakt oss"
            tittelProps="undertittel"
        >
            <div className="kontakt-oss__wrapper">
                <img className="kontakt-oss__ikon" src={iconKontaktNav} alt="" />
                <Undertittel className="kontakt-oss__tekst">Kontakt NAV</Undertittel>
            </div>
        </LenkepanelMedLogging>
    );
};

export default KontaktOss;
