import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import { hentOrganisasjoner, hentSyfoTilgang } from "./api/dnaApi";

export interface Context {
  organisasjoner: Array<Organisasjon>;
  tilgangTilSyfo: boolean;
}

interface State {
  organisasjoner: Array<Organisasjon>;
  tilgangTilSyfo: boolean;
}

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export class OrganisasjonsListeProvider extends Component<{}, State> {
  state: State = {
    organisasjoner: [],
    tilgangTilSyfo: false
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    let tilgangSyfo = await hentSyfoTilgang();
    this.setState({ organisasjoner, tilgangTilSyfo: tilgangSyfo });
  }

  render() {
    const context: Context = {
      ...this.state
    };

    return (
      <OrganisasjonsListeContext.Provider value={context}>
        {this.props.children}
      </OrganisasjonsListeContext.Provider>
    );
  }
}
