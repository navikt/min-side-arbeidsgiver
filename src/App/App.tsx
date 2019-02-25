import React, { Component } from "react";
import Notificationboks from "./Notificationboks/Notificationboks";
import "./App.less";
import { Sidetittel, Undertittel } from "nav-frontend-typografi";

import mann from "./forfra.svg";

import { Panel } from "nav-frontend-paneler";
import Banner from "./Banner/Banner";
import { hentHello } from "../api/dnaApi";

interface State {
  tekst: string;
}

class App extends Component<{}, State> {
  state = {
    tekst: ""
  };

  async componentDidMount() {
    let tekst = await hentHello();
    this.setState({ tekst: tekst });
  }

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
          />

          <Notificationboks
            bildeurl={mann}
            notification={false}
            tittel={"Foreldrepenger"}
            undertittel={"3 i foreldrepermisjon"}
          />

          <Notificationboks
            bildeurl={mann}
            notification={true}
            tittel={"Arbeidstrening"}
            undertittel={this.state.tekst}
          />
        </div>
      </div>
    );
  }
}

export default App;
