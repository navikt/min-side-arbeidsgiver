import React, { FunctionComponent } from 'react';
import {Alert, BodyLong, BodyShort, Heading} from "@navikt/ds-react";
import { DisplayBetween } from '../../../GeneriskeElementer/DisplayBetween';


export const VarselHvisNedetid: FunctionComponent = () => {
    const showFrom = new Date('2022-03-08T19:00:00+02:00');
    const showUntil = new Date('2022-03-09T06:00:00+02:00');

    return (
        <DisplayBetween showFrom={showFrom} showUntil={showUntil}>
            <div className={'nedetid'}>
                <Alert variant="warning" size="medium" className='nedetid__varsel'>
                    <Heading spacing size="small">
                        Tjenester for arbeidsgivere kan være utilgjengelig
                    </Heading>
                    <BodyLong>
                        Fra i kveld (tirsdag 8. mars, klokken 23:00) til i morgen (9. mars, klokken 06:00) vil de fleste innloggede tjenester for arbeidsgivere på nav.no være utilgjengelig.
                    </BodyLong>
                    <BodyShort>
                        «Dine Sykmeldte» er et unntak, og burde fortsatt være tilgjengelig.
                    </BodyShort>
                    <BodyShort>
                        Dette skyldes vedlikehold i Altinn.
                    </BodyShort>
                    <BodyShort>
                        Vi beklager ulempene dette medfører.
                    </BodyShort>
                </Alert>
            </div>
        </DisplayBetween>
    );
};
