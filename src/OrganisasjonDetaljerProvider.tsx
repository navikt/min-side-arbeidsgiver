// Implementer en provider som:
//   - eier staten "valgt organisasjon" + antall annonser fra PAM
//   - eksponerer en funksjon velgOrganisasjon som skal sette state til gitt organisasjon, og sette inn informasjon om bedriften fra PAM.
import React, { Component, useContext } from "react";
import { Organisasjon } from "./organisasjon";
import { OrganisasjonsListeContext } from "./OrganisasjonsListeProvider";
import { pamHentStillingsannonser } from "./lenker";

export interface Context {
  valgtOrganisasjon?: Organisasjon;
  endreOrganisasjon: (orgnr: string) => void;
  antallAnnonser: number;
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
    valgtOrganisasjon: undefined,
    antallAnnonser: 0
  };
  async componentDidMount() {}

  endreOrganisasjon = (org: Organisasjon) => {
    this.hentAntallannonser;

    this.setState({ valgtOrganisasjon: org });
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
