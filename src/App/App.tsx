import React, { FunctionComponent } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.less";
import { basename } from "../paths";
import Hovedside from "./Hovedside/Hovedside";
import Banner from "./HovedBanner/HovedBanner";
import LoginBoundary from "./LoginBoundary";
import { OrganisasjonsListeProvider } from "../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerProvider } from "../OrganisasjonDetaljerProvider";
import { SyfoTilgangProvider } from "../SyfoTilgangProvider";
import InformasjonOmTilgangsstyringSide from "./InformasjonOmTilgangsstyringSide/InformasjonOmTilgangsstyringSide";
import { LoggInn } from "./LoggInn/LoggInn";

const App: FunctionComponent = () => {
  return (
    <div className="typo-normal">
      <BrowserRouter basename={basename}>
        <div>
          <Switch>
            <Route
              path="/informasjon-om-tilgangsstyring"
              exact={true}
              component={InformasjonOmTilgangsstyringSide}
            />

            <LoginBoundary>
              <OrganisasjonsListeProvider>
                <SyfoTilgangProvider>
                  <OrganisasjonsDetaljerProvider>
                    <Banner />
                    <div className="bakgrunnsside">
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
                        <Route path="/" exact={true} component={Hovedside} />
                      </Switch>
                    </div>
                  </OrganisasjonsDetaljerProvider>
                </SyfoTilgangProvider>
              </OrganisasjonsListeProvider>
            </LoginBoundary>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
