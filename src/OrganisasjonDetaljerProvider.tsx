// Implementer en provider som:
//   - eier staten "valgt organisasjon" + antall annonser fra PAM
//   - eksponerer en funksjon velgOrganisasjon som skal sette state til gitt organisasjon, og sette inn informasjon om bedriften fra PAM.
import React, { Component, useContext } from "react";
import { Organisasjon } from "./organisasjon";
import hentAntallannonser from "./hent-stillingsannonser";

export interface Context {
  valgtOrganisasjon?: Organisasjon;
  endreOrganisasjon: (org: Organisasjon) => void;
  antallAnnonser?: number;
}

interface State {
  valgtOrganisasjon?: Organisasjon;
  antallAnnonser?: number;
}

const OrganisasjonsDetaljerContext = React.createContext<Context>(
  {} as Context
);
export { OrganisasjonsDetaljerContext };

export class OrganisasjonsDetaljerProvider extends Component<{}, State> {
  state: State = {
    valgtOrganisasjon: undefined
  };
  async componentDidMount() {}

  endreOrganisasjon = async (org: Organisasjon) => {
    const antall = await hentAntallannonser();
    this.setState({
      valgtOrganisasjon: org,
      antallAnnonser: antall
    });
    console.log("antall annonser: ", antall);
  };

  render() {
    const context: Context = {
      ...this.state,
      endreOrganisasjon: this.endreOrganisasjon
    };

    return (
      <OrganisasjonsDetaljerContext.Provider value={context}>
        {this.props.children}
      </OrganisasjonsDetaljerContext.Provider>
    );
  }
}
