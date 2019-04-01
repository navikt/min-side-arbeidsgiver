import React, { FunctionComponent } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.less";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import LoginBoundary from "./LoginBoundary";
import { OrganisasjonsListeProvider } from "../OrganisasjonsListeProvider";

const App: FunctionComponent = () => {
  return (
    <LoginBoundary>
      <OrganisasjonsListeProvider>
        <div className={"bakgrunnsside"}>
          <Banner tittel={"Ditt nav arbeidsgiver"} />
          <BrowserRouter basename={basename}>
            <Switch>
              <Route path="/" exact={true} component={Hovedside} />
              {<Redirect to={"/"} />}
            </Switch>
          </BrowserRouter>
        </div>
      </OrganisasjonsListeProvider>
    </LoginBoundary>
  );
};

export default App;
