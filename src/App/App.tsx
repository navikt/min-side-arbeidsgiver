import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.less";
import { Organisasjon } from "../organisasjon";
import LoggInn from "./LoggInn/LoggInn";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import { hentOrganisasjoner } from "../api/dnaApi";

interface State {
  organisasjoner: Array<Organisasjon>;
}
class App extends Component<{}, State> {
  state = {
    organisasjoner: []
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    console.log(organisasjoner);
    this.setState({ organisasjoner });
  }

  render() {
    return (
      <div>
        <Banner
          tittel={"Ditt nav arbeidsgiver"}
          organisasjoner={this.state.organisasjoner}
        />
        <BrowserRouter basename={basename}>
          <Switch>
            <Route path="/login" exact={true} component={LoggInn} />
            <Route path="/" exact={true} component={Hovedside} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
