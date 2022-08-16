import React, { FunctionComponent } from 'react';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { loggNavigasjon } from '../../../../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';
import {Heading} from "@navikt/ds-react";

interface CustomLenkepanel {
    tittel: string;
    infoTekst: string;
    lenke: string;
}

export const ManglerTilgangLenkePanel: FunctionComponent<CustomLenkepanel> = props =>  {
    const {pathname} = useLocation()

    return (
        <div className={'mangler-tilgang-lenkepanel'}>
            <LenkepanelBase
                href={props.lenke}
                border
                onClick={() =>
                    loggNavigasjon(props.lenke, props.tittel, pathname)
                }
            >
                <div>
                    <div>
                        <Heading size="medium" level="2" className="lenkepanel__heading">{props.tittel}</Heading>
                        <p>{props.infoTekst}</p>
                    </div>
                </div>
            </LenkepanelBase>
        </div>
    );
}
