import React, { FunctionComponent } from 'react';
import './LoggInnBanner.less';
import { Sidetittel, Ingress } from 'nav-frontend-typografi';
import medhjelm from './med-hjelm.svg';
import telefon from './telefon-person.svg';

const LoggInnBanner: FunctionComponent = () => {
    return (
        <div className={'logg-inn-banner'}>
            <div className={'logg-inn-banner__container'}>
                <div className={'logg-inn-banner__tittel-og-tekst'}>
                    <Sidetittel className={'logg-inn-banner__tittel'}>
                        Min side - arbeidsgiver{' '}
                    </Sidetittel>
                    <Ingress className={'logg-inn-banner__ingress'}>
                        Innloggede tjenester for arbeidsgivere{' '}
                    </Ingress>
                </div>
                <div className={'logg-inn-banner__bilder'}>
                    <img src={medhjelm} alt={'Bilde av koffert for å illustrere arbeidsgivere'} />
                    <img src={telefon} alt={'Bilde av koffert for å illustrere arbeidsgivere'} />
                    <img src={telefon} alt={'Bilde av koffert for å illustrere arbeidsgivere'} />
                </div>
            </div>
        </div>
    );
};

export default LoggInnBanner;
