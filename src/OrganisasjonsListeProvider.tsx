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

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export class OrganisasjonsListeProvider extends Component<{}, State> {
  // Denne provideren skal BARE hente og gi ut organisasjoner, IKKE ha noe å gjøre med valgt organisasjon.
  // Burde renames.
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
