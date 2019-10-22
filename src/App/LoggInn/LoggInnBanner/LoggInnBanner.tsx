import React, { FunctionComponent } from 'react';
import './LoggInnBanner.less';
import { Sidetittel, Ingress } from 'nav-frontend-typografi';

const LoggInnBanner: FunctionComponent = () => {
    return (
        <div className={'logg-inn-banner'}>
            <div className={'logg-inn-banner__tittel-og-tekst'}>
                <Sidetittel className={'logg-inn-banner__tittel'}>
                    Min side - arbeidsgiver{' '}
                </Sidetittel>
                <Ingress className={'logg-inn-banner__ingress'}>
                    Innloggede tjenester for arbeidsgivere{' '}
                </Ingress>
            </div>
        </div>
    );
};

export default LoggInnBanner;
