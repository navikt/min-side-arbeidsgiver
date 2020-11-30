import React, { FunctionComponent } from "react";
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import environment from '../../utils/environment';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import './Logginn.less';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import { VarselOmNedetid } from "./VarselOmNedetid/VarselOmNedetid";


//tidspunkt som argumentstreng skrives på formen (2020-11-30T09:22:00Z), blir f.eks 30. november 2020, kl 10.22 ( 09:00 + en time = 10.00 pga tidsonen i Norge)

const advarselboksSettesPåString = '2020-11-30T09:22:00Z';
const nedetidboksSettesPaString = '2020-11-30T09:22:30Z';
const bokserSkalSlutteÅVisesString = '2020-11-30T09:23:00Z';

export const erIFortiden =(tidspunktString: string) => {
    const tidspunkt = new Date(tidspunktString);
    const nåVærendeTidspunkt = new Date();
    return nåVærendeTidspunkt > tidspunkt;
}

export const LoggInn: FunctionComponent = () => {
    let visAdvarselBoks = false;
    let visNedetid = false;

    const redirectTilLogin = () => {
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs'||environment.MILJO === 'labs-gcp') {
            window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        } else {
            document.cookie = 'selvbetjening-idtoken =0123456789..*; path=/;';
            window.location.href = '/min-side-arbeidsgiver';
        }
    };

        const bokserSkalSlutteÅVises = erIFortiden(bokserSkalSlutteÅVisesString)
        if (advarselboksSettesPåString.length >0  && nedetidboksSettesPaString.length>0 && !bokserSkalSlutteÅVises)  {
            const nedetidVises = erIFortiden(nedetidboksSettesPaString)
            visNedetid = nedetidVises
            if (erIFortiden(advarselboksSettesPåString) && !nedetidVises){
                visAdvarselBoks = true
            }
        }

    const visNedetidBokser = (visAdvarselBoks || visNedetid);

    return (
        <div className="innloggingsside">
            <Brodsmulesti brodsmuler={[]} />
            <LoggInnBanner />
            <div className="innloggingsside__innhold">
                {visNedetidBokser && <VarselOmNedetid advarselOmNedetid={visAdvarselBoks} nedetid={visNedetid}/>}
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