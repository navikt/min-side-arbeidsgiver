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
import InformasjonOmBedrift from "./InformasjonOmBedrift/InformasjonOmBedrift";
import LoggInn from "./LoggInn/LoggInn";
import InformasjonOmTilgangsstyring from "./LoggInn/InformasjonOmTilgangsstyring/InformasjonOmTilgangsstyring";

const App: FunctionComponent = () => {
  return (
    <BrowserRouter basename={basename}>
      <div>
        <Switch>
          <Route
            path="/informasjon-om-tilgangsstyring"
            exact={true}
            component={InformasjonOmTilgangsstyring}
          />
        </Switch>
        <LoginBoundary>
          <OrganisasjonsListeProvider>
            <SyfoTilgangProvider>
              <OrganisasjonsDetaljerProvider>
                <Banner />
                <div className="bakgrunnsside typo-normal">
                  <Switch>
                    <Route
                      path="/:orgnummer"
                      exact={true}
                      component={Hovedside}
                    />
                    <Route
                      path="/:orgnummer/bedriftsinformasjon"
                      exact={true}
                      component={LoggInn}
                    />
                  </Switch>
                </div>
              </OrganisasjonsDetaljerProvider>
            </SyfoTilgangProvider>
          </OrganisasjonsListeProvider>
        </LoginBoundary>
      </div>
    </BrowserRouter>
  );
};

export default App;
