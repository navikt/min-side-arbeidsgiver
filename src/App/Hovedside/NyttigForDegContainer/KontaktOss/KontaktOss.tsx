import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Lenkepanel from 'nav-frontend-lenkepanel';
import iconKontaktNav from './kontaktossikon.svg';
import './KontaktOss.less';

const KontaktOss = () => {
    const loggAtKlikketPaKontaktskjema = () => {
        //loggNavigasjonTilTjeneste('kontaktskjema');
    };

    return (
        <Lenkepanel
            className="kontakt-oss"
            href="https://arbeidsgiver.nav.no/kontakt-oss/"
            tittelProps="undertittel"
            onClick={loggAtKlikketPaKontaktskjema}
        >
            <div className="kontakt-oss__wrapper">
                <img className="kontakt-oss__ikon" src={iconKontaktNav} alt="" />
                <Undertittel className="kontakt-oss__tekst">Kontakt NAV</Undertittel>
            </div>
        </Lenkepanel>
    );
};

export default KontaktOss;
