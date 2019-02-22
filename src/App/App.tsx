import React, { Component } from "react";
import Notificationboks from "./Notificationboks/Notificationboks";
import "./App.less";
import { Sidetittel, Undertittel } from "nav-frontend-typografi";

import mann from "./forfra.svg";
import varsel from "./fill-7.svg";

import { Panel } from "nav-frontend-paneler";
import Banner from "./Banner/Banner";

class App extends Component {
  render() {
    return (
      <div className="forside">
        <Banner
          tittel={"Ditt nav arbeidsgiver"}
          bildeurl={"null"}
          organisasjoner={["aha", "nav"]}
        />
        <div className={"notifikasjonsbokser"}>
          <Notificationboks
            bildeurl={mann}
            notification={true}
            tittel={"Sykemeldte"}
            undertittel={"6 sykemeldte"}
            notify={varsel}
          />

          <Notificationboks
            bildeurl={mann}
            notification={false}
            tittel={"Foreldrepenger"}
            undertittel={"3 i foreldrepermisjon"}
            notify={varsel}
          />

          <Notificationboks
            bildeurl={mann}
            notification={true}
            tittel={"Arbeidstrening"}
            undertittel={"7 på tiltak"}
            notify={varsel}
          />
        </div>
      </div>
    );
  }
}

export default App;
