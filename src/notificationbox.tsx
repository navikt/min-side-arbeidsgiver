import React, { Component } from 'react';
import './notificationbox.less';
import notify from './notify.png';
import {Systemtittel,Normaltekst,Innholdstittel} from 'nav-frontend-typografi';
import PanelBase, {Panel} from 'nav-frontend-paneler';



interface Props {
    tittel: string;
    bildeurl: string;
    notify: string;
    undertittel: string;
    notification: boolean;

}

class Notificationbox extends Component<Props> {
    constructor(props: Props) {
        super(props);

    }
    render () {
        return (

                <Panel className={"bokspanel"}border={true}>

                    {this.props.notification ? (
                     <img className={ "notify"} src={this.props.notify}/>
                    ) : (
                        null
                    )}
                    <img className={"icon"} src= {this.props.bildeurl} />
                    <Innholdstittel className={"hovedtittel"}>{this.props.tittel}</Innholdstittel>
                    <Normaltekst>{this.props.undertittel}</Normaltekst>

                </Panel>




        );
    }



}

export default Notificationbox;