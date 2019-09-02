import React, { FunctionComponent } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import './Logginn.less';
import { logInfo } from '../../utils/metricsUtils';
import koffert from '../Hovedside/group.svg';
import Lenke from 'nav-frontend-lenker';
import LoggInnBanner from './LoggInnBanner/LoggInnBanner';
import { Sidetittel } from 'nav-frontend-typografi';
import { Innloggingstjenester } from './Innloggingstjenester/Innloggingstjenester';
import { TilgangsStyringInfoTekst } from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import environment from '../../utils/environment';

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
        <div className="innloggingsside">
            <LoggInnBanner />
            <div className={'innloggingsside__innhold'}>
                <img
                    src={koffert}
                    alt={'Bilde av koffert for å illustrere arbeidsgivere'}
                    className={'innloggingsside__ikon'}
                />
                <Sidetittel className={'innloggingsside__sidetittel'}>
                    Arbeidsgivertjenester fra NAV på ett sted
                </Sidetittel>
                <div className={'innloggingsside__tekst'}>
                    En felles inngang til tjenestene gjør det enklere for deg å samarbeide med oss.
                    Her vil du finne tjenester og oppgaver relatert til:
                </div>
                <Innloggingstjenester />
                <TilgangsStyringInfoTekst />
                <Hovedknapp className={'innloggingsside__loginKnapp'} onClick={redirectTilLogin}>
                    Logg inn
                </Hovedknapp>
                <div className="innloggingsside__besok-ditt-nav">
                    Ønsker du å se dine tjenester som privatperson?{' '}
                    <Lenke href={'https://www.nav.no/no/Person'}>Logg inn på Ditt NAV</Lenke>
                </div>
            </div>
        </div>
    );
};
