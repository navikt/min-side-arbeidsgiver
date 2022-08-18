import React, { FunctionComponent } from 'react';
import './LoggInnBanner.css';
import medhjelm from './med-hjelm.svg';
import telefon from './telefon-person.svg';
import kokk from './kokk.png';
import {Heading, Ingress} from "@navikt/ds-react"

const LoggInnBanner: FunctionComponent = () => {
    return (
        <div className={'logg-inn-banner'}>
            <div className={'logg-inn-banner__container'}>
                <div className={'logg-inn-banner__tittel-og-tekst'}>
                    <Heading size="xlarge" level="1" className={'logg-inn-banner__tittel'}>
                        Min side – arbeidsgiver{' '}
                    </Heading>
                    <Ingress className={'logg-inn-banner__ingress'}>
                        Innloggede tjenester for arbeidsgiver{' '}
                    </Ingress>
                </div>
                <div className={'logg-inn-banner__bilder'}>
                    <img src={medhjelm} alt={''} />
                    <img src={telefon} alt={''} />
                    <img src={kokk} alt={''} />
                </div>
            </div>
        </div>
    );
};

export default LoggInnBanner;
