import React, { FunctionComponent } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.less";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./Banner/Banner";
import LoginBoundary from "./LoginBoundary";
import { OrganisasjonsListeProvider } from "../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerProvider } from "../OrganisasjonDetaljerProvider";
import { SyfoTilgangProvider } from "../SyfoTilgangProvider";
import MineAnsatte from "./InformasjonOmBedrift/MineAnsatte/MineAnsatte";

const App: FunctionComponent = () => {
  return (
    <div className="bakgrunnsside typo-normal">
      <LoginBoundary>
        <OrganisasjonsListeProvider>
          <SyfoTilgangProvider>
            <BrowserRouter basename={basename}>
              <OrganisasjonsDetaljerProvider>
                <Banner />

                <Switch>
                  <Route
                    path="/:orgnummer"
                    exact={true}
                    component={Hovedside}
                  />
                  <Route
                    path="/:orgnummer/bedriftsinformasjon"
                    exact={true}
                    component={MineAnsatte}
                  />
                </Switch>
              </OrganisasjonsDetaljerProvider>
            </BrowserRouter>
          </SyfoTilgangProvider>
        </OrganisasjonsListeProvider>
      </LoginBoundary>
    </div>
  );
};

export default App;
