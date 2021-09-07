import React, { FunctionComponent } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';
import { loggNavigasjon } from '../../../../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';

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
                    loggNavigasjon('mangler-tilgang', props.lenke, props.tittel, pathname)
                }
            >
                <div>
                    <div>
                        <Systemtittel className="lenkepanel__heading">{props.tittel}</Systemtittel>
                        <p>{props.infoTekst}</p>
                    </div>
                </div>
            </LenkepanelBase>
        </div>
    );
}
