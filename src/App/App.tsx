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
  valgtOrganisasjon?: Organisasjon;
}
class App extends Component<{}, State> {
  state: State = {
    organisasjoner: [],
    valgtOrganisasjon: undefined
  };

  endreOrganisasjon = (orgnr: string) => {
    const valgtOrganisasjon = this.state.organisasjoner.find(
      org => orgnr === org.OrganizationNumber
    );

    this.setState({ valgtOrganisasjon: valgtOrganisasjon });
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    this.setState({ organisasjoner });
  }

  render() {
    return (
      <div className={"bakgrunnsside"}>
        <Banner
          tittel={"Ditt nav arbeidsgiver"}
          organisasjoner={this.state.organisasjoner}
          endreOrganisasjon={this.endreOrganisasjon}
          organisasjon={this.state.valgtOrganisasjon}
        />
        <LoginBoundary>
          <BrowserRouter basename={basename}>
            <Switch>
              <Route path="/" exact={true} component={Hovedside} />
            </Switch>
          </BrowserRouter>
        </LoginBoundary>
      </div>
    );
  }
}

export default App;
