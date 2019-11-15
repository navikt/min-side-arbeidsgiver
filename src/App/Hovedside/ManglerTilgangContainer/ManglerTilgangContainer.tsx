import React, {FunctionComponent} from "react";
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import {Innholdstittel, Systemtittel} from "nav-frontend-typografi";
import './ManglerTilgangContainer.less'

interface CustomLenkepanel{
    tittel:string
    infoTekst:string
}

export const ManglerTilgangContainer:FunctionComponent = ()=> {

    return(<div>
        <Innholdstittel>Du mangler tilganger</Innholdstittel>
        <span className={"mangler-tilgang-container"}>
            <ManglerTilgangLenkePanel tittel="Se tjenester som privatperson" infoTekst="Gå til Ditt NAV"/>
            <ManglerTilgangLenkePanel tittel="Hvordan får jeg tilgang?" infoTekst="Lær om roller og tilganger i Altinn"/>
        </span>
    </div>
    )};

const ManglerTilgangLenkePanel:FunctionComponent<CustomLenkepanel> = (props)=> {
    return (
        <div className={"mangler-tilgang-lenkepanel"}>
        <LenkepanelBase href="#" border>
        <div>
            <div>
                <Systemtittel className="lenkepanel__heading">{props.tittel}</Systemtittel>
                <p>
                    {props.infoTekst}
                </p>
            </div>
        </div>
    </LenkepanelBase>
            </div>);
};