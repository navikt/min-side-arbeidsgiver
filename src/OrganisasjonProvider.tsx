import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import { hentOrganisasjoner } from "./api/dnaApi";

export interface Context {
  valgtOrganisasjon?: Organisasjon;
  organisasjoner: Array<Organisasjon>;
  endreOrganisasjon: (orgnr: string) => void;
}

interface State {
  valgtOrganisasjon?: Organisasjon;
  organisasjoner: Array<Organisasjon>;
}

const OrganisasjonContext = React.createContext<Context>({} as Context);
export { OrganisasjonContext };

export class OrganisasjonProvider extends Component<{}, State> {
  state: State = {
    valgtOrganisasjon: undefined,
    organisasjoner: []
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    this.setState({ organisasjoner });
    if (organisasjoner[0]) {
      this.setState({ valgtOrganisasjon: organisasjoner[0] });
    }
  }

  endreOrganisasjon = (orgnr: string) => {
    const valgtOrganisasjon = this.state.organisasjoner.find(
      org => orgnr === org.OrganizationNumber
    );
    this.setState({ valgtOrganisasjon: valgtOrganisasjon });
  };

  render() {
    const context: Context = {
      ...this.state,
      endreOrganisasjon: this.endreOrganisasjon
    };

    return (
      <OrganisasjonContext.Provider value={context}>
        {this.props.children}
      </OrganisasjonContext.Provider>
    );
  }
}
