import React, { Component } from 'react';
import Notificationbox from './notificationbox';
import logo from './logo.svg';
import './App.less';
import {Input} from "nav-frontend-skjema";
import {Normaltekst, Sidetittel, Systemtittel,Undertittel} from "nav-frontend-typografi";
import Veilederpanel from 'nav-frontend-veilederpanel';
import Veileder from 'nav-frontend-veileder';
import navkopp from './navkopp.png';
import forsidebilde from './forside.png';
import mann from './forfra.svg';
import varsel from './fill-7.svg';

import PanelBase from 'nav-frontend-paneler';
import { Select } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {Panel} from 'nav-frontend-paneler';


class App extends Component {
  render() {
    return (



        <div className = "forside">



            <div className="sitelogo sitelogo-large">
                <div className="container"><a href="https://www.nav.no/no/Person" title="Hjem"
                                              data-ga="Header/Logo"><img
                    src="https://www.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0" alt="NAV-logo"/></a>
                </div>
            </div>
            <Sidetittel className={"overskrift"}>Ditt NAV Arbeidsgiver </Sidetittel>

            <div className={"hovedcontainer"}>
            <div className={"container1"}>
                <div className={"boks11"}>
              <Notificationbox bildeurl={mann} notification={true} tittel={"Sykemeldte"} undertittel={"6 sykemeldte"} notify = {varsel} />
              </div>
                <div className={"boks21"}>
              <Panel className={"nyboks"}border={true}>
                    <Undertittel><span>Finn nye </span> medarbeidere </Undertittel>
                </Panel>
                </div>
                <div className={"boks31"}>
                <Panel className={"nyboks3"}border={true}>
                    <Undertittel><span>Finn nye </span> medarbeidere </Undertittel>
                </Panel>
                </div>
            </div>

            <div className={"container2"}>
            <div className= {"containerTwoNotificationBoxes"}>
                <div className={"boks12"}>
                <Notificationbox bildeurl={mann} notification={true} tittel={"Foreldrepenger"} undertittel={"3 i foreldrepermisjon"} notify = {varsel} />
                </div>
                <div className={"boks13"}>
                <Notificationbox bildeurl={mann} notification={true} tittel={"Arbeidstrening"} undertittel={"7 på tiltak"} notify = {varsel} />
                </div>
                </div>
                <div className={"boks22"}>
                <Panel className={"nyboks2"}border={true}>
                    <Undertittel><span>Finn nye </span> medarbeidere </Undertittel>
                </Panel>
                    </div>
                <div className={"boks31"}>
                <Panel className={"nyboks4"}border={true}>
                    <Undertittel><span>Finn nye </span> medarbeidere </Undertittel>
                </Panel>
                    </div>

            </div>
            </div>


        </div>


    );
  }
}

export default App;




