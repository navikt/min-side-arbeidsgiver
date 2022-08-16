import React, { FunctionComponent } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import './VarselOmNedetid.less';
import { DisplayBetween } from '../../../GeneriskeElementer/DisplayBetween';
import {Label} from "@navikt/ds-react";


export const VarselHvisNedetid: FunctionComponent = () => {
    const showFrom = new Date('2022-03-08T19:00:00+02:00');
    const showUntil = new Date('2022-03-09T06:00:00+02:00');

    return (
        <DisplayBetween showFrom={showFrom} showUntil={showUntil}>
            <div className={'nedetid'}>
                <AlertStripe type="advarsel" className={'nedetid__varsel'}>
                    <Label className={'nedetid__varsel-overskrift'}>
                        Tjenester for arbeidsgivere kan være utilgjengelig
                    </Label>
                    <p className="typo-normal">
                        Fra i kveld (tirsdag 8. mars, klokken 23:00) til i morgen (9. mars, klokken 06:00) vil de fleste innloggede tjenester for arbeidsgivere på nav.no være utilgjengelig.
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
            </div>
        </DisplayBetween>
    );
};
