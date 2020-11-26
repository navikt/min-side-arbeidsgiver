import React, { FunctionComponent, useEffect, useState } from "react";
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import environment from '../../utils/environment';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './Logginn.less';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestVersjon/AdvarselBannerTestversjon';


//tidspunkt skirves på formen (2015-03-25T12:00:00Z"); blir f.eks klokka 13.00 ( 12:00 + en time = 13.00 pga tidsonen i Norge

const advarselboksSettesPåString = '';
const nedetidboksSettesPaString = ''

export const regnUtOmBoksSkalVises =(tidspunkt: Date) => {
    const nåVærendeTidspunkt = new Date();
    return nåVærendeTidspunkt > tidspunkt;
}

export const LoggInn: FunctionComponent = () => {
    const [visAdvarselBoks, setVisAdvarselBoks] = useState(false)
    const [visNedetid, setVisNedetid] = useState(false)

    const advarselboksSettesPåString = '';
    const nedetidboksSettesPaString = ''

    const redirectTilLogin = () => {
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs'||environment.MILJO === 'labs-gcp') {
            window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        } else {
            document.cookie = 'selvbetjening-idtoken =0123456789..*; path=/;';
            window.location.href = '/min-side-arbeidsgiver';
        }
    };

    useEffect(() => {
        if (advarselboksSettesPåString.length >0  && nedetidboksSettesPaString.length>0)  {
            const tidForAdvarselBoks = new Date(advarselboksSettesPåString);
            const tidForNedetidBoks = new Date(nedetidboksSettesPaString);
            const nedetidVises = regnUtOmBoksSkalVises(tidForNedetidBoks)
            setVisAdvarselBoks(nedetidVises)
            if (!nedetidVises) {
                if (regnUtOmBoksSkalVises(tidForAdvarselBoks)){
                    setVisNedetid(true)
                }
                else {
                    setVisNedetid(false)
                }
            }

        }
    }, []);



    return (
        <div className="innloggingsside">
            <Brodsmulesti brodsmuler={[]} />
            <LoggInnBanner />
            <div className="innloggingsside__innhold">
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