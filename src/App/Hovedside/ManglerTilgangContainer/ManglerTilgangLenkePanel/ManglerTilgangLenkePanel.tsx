import React, { FunctionComponent } from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { LenkepanelBase } from 'nav-frontend-lenkepanel/lib';

interface CustomLenkepanel {
    tittel: string;
    infoTekst: string;
    lenke: string;
}

export const ManglerTilgangLenkePanel: FunctionComponent<CustomLenkepanel> = props => {
    return (
        <div className={'mangler-tilgang-lenkepanel'}>
            <LenkepanelBase href={props.lenke} border>
                <div>
                    <div>
                        <Systemtittel className="lenkepanel__heading">{props.tittel}</Systemtittel>
                        <p>{props.infoTekst}</p>
                    </div>
                </div>
            </LenkepanelBase>
        </div>
    );
};
