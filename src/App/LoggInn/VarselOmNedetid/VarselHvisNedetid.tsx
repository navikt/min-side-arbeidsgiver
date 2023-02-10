import React, { FunctionComponent } from 'react';
import {Alert, BodyLong, BodyShort, Heading} from "@navikt/ds-react";
import { DisplayBetween } from '../../../GeneriskeElementer/DisplayBetween';


export const VarselHvisNedetid: FunctionComponent = () => {
    // const showFrom = new Date('2022-03-08T19:00:00+02:00');
    // const showUntil = new Date('2022-03-09T06:00:00+02:00');

    return (
        // <DisplayBetween showFrom={showFrom} showUntil={showUntil}>
            <div className={'nedetid'}>
                <Alert variant="warning" size="medium" className='nedetid__varsel'>
                    <Heading spacing size="small">
                        Driftsproblemer
                    </Heading>
                    <BodyLong>
                        Min side – arbeidsgiver er ustabil, og det kan det være du ikke
                        ser saker, beskjeder eller oppgaver du egentlig skal se.
                        Prøv igjen senere.
                    </BodyLong>
                </Alert>
            </div>
        // </DisplayBetween>
    );
};
