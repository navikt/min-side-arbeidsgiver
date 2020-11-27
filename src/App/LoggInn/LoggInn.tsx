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


//tidspunkt skirves på formen (2015-03-25T12:00:00Z"); blir f.eks klokka 25. mars 2015, kl 13.00 ( 12:00 + en time = 13.00 pga tidsonen i Norge)

const advarselboksSettesPåString = '2020-11-27T09:47:00Z';
const nedetidboksSettesPaString = '2020-11-27T09:47:30Z';
const bokserSkalSlutteÅVisesString = '2020-11-27T09:48:00Z';

export const erIFortiden =(tidspunktString: string) => {
    const tidspunkt = new Date(tidspunktString);
    const nåVærendeTidspunkt = new Date();
    return nåVærendeTidspunkt > tidspunkt;
}

export const LoggInn: FunctionComponent = () => {
    const [visAdvarselBoks, setVisAdvarselBoks] = useState(false)
    const [visNedetid, setVisNedetid] = useState(false)

    const redirectTilLogin = () => {
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs'||environment.MILJO === 'labs-gcp') {
            window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        } else {
            document.cookie = 'selvbetjening-idtoken =0123456789..*; path=/;';
            window.location.href = '/min-side-arbeidsgiver';
        }
    };

    useEffect(() => {
        const bokserSkalSlutteÅVises = erIFortiden(bokserSkalSlutteÅVisesString)
        if (advarselboksSettesPåString.length >0  && nedetidboksSettesPaString.length>0 && !bokserSkalSlutteÅVises)  {
            const nedetidVises = erIFortiden(nedetidboksSettesPaString)
            setVisNedetid(nedetidVises)
            if (erIFortiden(advarselboksSettesPåString) && !nedetidVises){
                setVisAdvarselBoks(true)
            }
        }
    }, []);

    const visNyBoks = (visAdvarselBoks || visNedetid);

    const nedetidTekst = visNedetid? 'nedetiden er NÅ' : ''
    const advarselTekst = visAdvarselBoks? 'nedetiden kommer' : ''

    return (
        <div className="innloggingsside">
            <Brodsmulesti brodsmuler={[]} />
            <LoggInnBanner />
            <div className="innloggingsside__innhold">
                {visNyBoks && <Normaltekst> {nedetidTekst + advarselTekst}</Normaltekst>}
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