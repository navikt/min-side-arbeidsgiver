import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.less";
import { Organisasjon } from "../organisasjon";
import LoggInn from "./LoggInn/LoggInn";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import { hentOrganisasjoner } from "../api/dnaApi";
import LoginBoundary from "./LoginBoundary";

interface State {
  organisasjoner: Array<Organisasjon>;
}
class App extends Component<{}, State> {
  state = {
    organisasjoner: []
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    this.setState({ organisasjoner });
  }

  render() {
    return (
      <>
        <Banner
          tittel={"Ditt nav arbeidsgiver"}
          organisasjoner={this.state.organisasjoner}
        />
        <LoginBoundary>
          <BrowserRouter basename={basename}>
            <Switch>
              <Route path="/" exact={true} component={Hovedside} />
            </Switch>
          </BrowserRouter>
        </LoginBoundary>
      </>
    );
  }
}

export default App;
