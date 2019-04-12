import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import hentAntallannonser from "./hent-stillingsannonser";
import { settBedriftIPamOgReturnerTilgang } from "./api/pamApi";

interface State {
  valgtOrganisasjon?: Organisasjon;
  antallAnnonser: number;
  tilgangTilPam: boolean;
}

export type Context = State & {
  endreOrganisasjon: (org: Organisasjon) => void;
};

const OrganisasjonsDetaljerContext = React.createContext<Context>(
  {} as Context
);
export { OrganisasjonsDetaljerContext };

export class OrganisasjonsDetaljerProvider extends Component<{}, State> {
  state: State = {
    tilgangTilPam: false,
    antallAnnonser: 0
  };

  endreOrganisasjon = async (org: Organisasjon) => {
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );
    if (harPamTilgang) {
      this.setState({
        valgtOrganisasjon: org,
        antallAnnonser: await hentAntallannonser(),
        tilgangTilPam: true
      });
    } else {
      this.setState({
        valgtOrganisasjon: org,
        tilgangTilPam: false,
        antallAnnonser: 0
      });
    }
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
