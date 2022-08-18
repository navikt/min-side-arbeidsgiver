import React, {FunctionComponent} from 'react';
import {loggNavigasjon} from '../../../../utils/funksjonerForAmplitudeLogging';
import {useLocation} from 'react-router-dom';
import {LinkPanel} from "@navikt/ds-react";

interface CustomLenkepanel {
    tittel: string;
    infoTekst: string;
    lenke: string;
}

export const ManglerTilgangLenkePanel: FunctionComponent<CustomLenkepanel> = props => {
    const {pathname} = useLocation()

    return (
        <div className={'mangler-tilgang-lenkepanel'}>
            <LinkPanel
                href={props.lenke}
                border
                onClick={() =>
                    loggNavigasjon(props.lenke, props.tittel, pathname)
                }
            >
                <LinkPanel.Title>
                    {props.tittel}
                </LinkPanel.Title>
                <LinkPanel.Description>
                    {props.infoTekst}
                </LinkPanel.Description>
            </LinkPanel>
        </div>
    );
}
