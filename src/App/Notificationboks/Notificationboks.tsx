import React, {Component, FunctionComponent} from 'react';
import './Notificationboks.less';
import {Systemtittel,Normaltekst,Innholdstittel} from 'nav-frontend-typografi';
import PanelBase, {Panel} from 'nav-frontend-paneler';



interface Props {
    tittel: string;
    bildeurl: string;
    notify: string;
    undertittel: string;
    notification: boolean;
}

const Notificationboks: FunctionComponent<Props> = (props) => {
        return (
                <Panel className={"bokspanel"} border={true}>

                    {props.notification ? (
                     <img className={ "notify"} src={props.notify}/>
                    ) : (
                        null
                    )}
                    <img className={"icon"} src= {props.bildeurl} />
                    <Innholdstittel className={"hovedtittel"}>{props.tittel}</Innholdstittel>
                    <Normaltekst>{props.undertittel}</Normaltekst>

                </Panel>
        );
    };

export default Notificationboks;