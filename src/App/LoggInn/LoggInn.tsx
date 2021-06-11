import React, { FunctionComponent } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import environment from '../../utils/environment';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import { VarselHvisNedetid } from './VarselOmNedetid/VarselHvisNedetid';
import './Logginn.less';

export const LoggInn: FunctionComponent = () => {

    const redirectTilLogin = () => {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
    };

    return (
        <div className="innloggingsside">
            <Brodsmulesti brodsmuler={[]} />
            <LoggInnBanner />
            <div className="innloggingsside__innhold">
                <VarselHvisNedetid/>
                <AdvarselBannerTestversjon/>
                <Systemtittel className="innloggingsside__sidetittel">
                    På Min side – arbeidsgiver kan du:
                </Systemtittel>
                <ul className="innloggingsside__punktliste">
                    <li className="innloggingsside__punkt">
                        få oversikt over dine sykmeldte
                    </li>
                    <li className="innloggingsside__punkt">
                        se sykfraværsstatistikk for din virksomhet
                    </li>
                    <li className="innloggingsside__punkt">
                        rekruttere nye medarbeidere
                    </li>
                    <li className="innloggingsside__punkt">
                        få oversikt over dine ansatte (fra Aa-registeret)
                    </li>
                    <li className="innloggingsside__punkt">
                        sende inn digitale skjemaer
                    </li>
                </ul>
                <TilgangsStyringInfoTekst />

                <Hovedknapp
                    className="innloggingsside__loginKnapp"
                    onClick={redirectTilLogin}
                >
                    Logg inn
                </Hovedknapp>

                <div className="innloggingsside__besok-ditt-nav">
                    <Normaltekst>Ønsker du å se dine tjenester som privatperson? </Normaltekst>
                    <Lenke href={'https://www.nav.no/person/dittnav/'}>
                        Logg inn på Ditt NAV
                    </Lenke>
                </div>
            </div>
        </div>
    );
};