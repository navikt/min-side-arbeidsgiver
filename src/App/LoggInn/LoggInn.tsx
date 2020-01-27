import React, { FunctionComponent } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import './Logginn.less';
import { logInfo } from '../../utils/metricsUtils';
import Lenke from 'nav-frontend-lenker';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';
import { Systemtittel } from 'nav-frontend-typografi';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import environment from '../../utils/environment';
import AlertStripe from "nav-frontend-alertstriper";

export const LoggInn: FunctionComponent = () => {
    const redirectTilLogin = () => {
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs') {
            logInfo('klikk på login');
            window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        } else {
            document.cookie = 'nav-esso=0123456789..*; path=/;';
            document.cookie = 'selvbetjening-idtoken =0123456789..*; path=/;';
            window.location.href = '/min-side-arbeidsgiver/';
        }
    };
    return (
        <>
            {
                <div className="innloggingsside">
                    <LoggInnBanner />
                    <div className={'innloggingsside__innhold'}>
                        <AlertStripe type={"feil"} className={"FeilStripe"}>Vi opplever for øyeblikket problemer med å laste inn innholdet til Min side – arbeidsgiver. Vi prøver å løse saken så raskt som mulig.</AlertStripe>
                        <Systemtittel className={'innloggingsside__sidetittel'}>
                            På Min side – arbeidsgiver kan du:
                        </Systemtittel>

                        <ul className="innloggingsside__punktliste">
                            <li className={'innloggingsside__punkt'}>
                                {' '}
                                få oversikt over dine sykmeldte
                            </li>
                            <li className={'innloggingsside__punkt'}>
                                se sykfraværsstatistikk for din virksomhet
                            </li>
                            <li className={'innloggingsside__punkt'}>
                                rekruttere nye medarbeidere
                            </li>
                            <li className={'innloggingsside__punkt'}>
                                sende inn digitale skjemaer
                            </li>
                        </ul>
                        <TilgangsStyringInfoTekst />

                        <Hovedknapp
                            className={'innloggingsside__loginKnapp'}
                            onClick={redirectTilLogin}
                        >
                            Logg inn
                        </Hovedknapp>

                        <div className="innloggingsside__besok-ditt-nav">
                            Ønsker du å se dine tjenester som privatperson? <br />
                            <Lenke href={'https://www.nav.no/person/dittnav/'}>
                                Logg inn på Ditt NAV
                            </Lenke>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};
