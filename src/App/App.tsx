import React, { FunctionComponent } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.less";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import LoginBoundary from "./LoginBoundary";
import { OrganisasjonProvider } from "../OrganisasjonProvider";

const App: FunctionComponent = () => {
  return (
    <LoginBoundary>
      <OrganisasjonProvider>
        <div className={"bakgrunnsside"}>
          <Banner tittel={"Ditt nav arbeidsgiver"} />
          <BrowserRouter basename={basename}>
            <Switch>
              <Route path="/" exact={true} component={Hovedside} />
              {/*<Redirect to={"/"} />*/}
            </Switch>
          </BrowserRouter>
        </div>
      </OrganisasjonProvider>
    </LoginBoundary>
  );
};

export default App;
