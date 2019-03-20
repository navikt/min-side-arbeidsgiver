import React, { FunctionComponent, useContext, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.less";
import { Organisasjon } from "../organisasjon";
import LoggInn from "./LoggInn/LoggInn";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import { hentOrganisasjoner } from "../api/dnaApi";
import LoginBoundary from "./LoginBoundary";
import {
  OrganisasjonContext,
  OrganisasjonProvider
} from "../OrganisasjonProvider";

const App: FunctionComponent = () => {
  return (
    <LoginBoundary>
      <OrganisasjonProvider>
        <div className={"bakgrunnsside"}>
          <Banner tittel={"Ditt nav arbeidsgiver"} />
          <BrowserRouter basename={basename}>
            <Switch>
              <Route path="/" exact={true} component={Hovedside} />
            </Switch>
          </BrowserRouter>
        </div>
      </OrganisasjonProvider>
    </LoginBoundary>
  );
};

export default App;
