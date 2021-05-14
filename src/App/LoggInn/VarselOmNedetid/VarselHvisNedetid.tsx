import React, { FunctionComponent } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import './VarselOmNedetid.less';
import { DisplayBetween } from '../../../GeneriskeElementer/DisplayBetween';


export const VarselHvisNedetid: FunctionComponent = () => {
    const showFrom = new Date('2021-05-14T00:00:00+02:00');
    const showUntil = new Date('2021-05-15T10:00:00+02:00');

    return (
        <div className={'nedetid'}>
            <DisplayBetween showFrom={showFrom} showUntil={showUntil}>
                <AlertStripe type="advarsel" className={'nedetid__varsel'}>
                    <Element className={'nedetid__varsel-overskrift'}>
                        Tjenester for arbeidsgivere kan være utilgjengelig
                    </Element>
                    <p className="typo-normal">
                        Fra i kveld (fredag 14. mai, klokken 21:00) til i morgen formiddag (lørdag 15. mai, klokken 10:00) vil de fleste innloggede tjenester for arbeidsgivere på nav.no være utilgjengelig.
                    </p>

                    <p className="typo-normal">
                        «Dine Sykmeldte» er et unntak, og burde fortsatt være tilgjengelig.
                    </p>

                    <p className="typo-normal">
                        Dette skyldes vedlikehold i Altinn.
                    </p>

                    <p className="typo-normal">
                        Vi beklager ulempene dette medfører.
                    </p>
                </AlertStripe>
            </DisplayBetween>
        </div>
    );
};
