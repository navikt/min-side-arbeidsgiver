import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import { settBedriftIPamOgReturnerTilgang } from "./api/pamApi";
import hentAntallannonser from "./hent-stillingsannonser";
import { TilgangSyfo } from "./SyfoTilgangProvider";

export enum TilgangPam {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

export enum TilgangAltinn {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

interface State {
  valgtOrganisasjon?: Organisasjon;
  antallAnnonser: number;
  tilgangTilPamState: TilgangPam;
  tilgangTilAltinnState: TilgangAltinn;
}

export type Context = State & {
  endreOrganisasjon: (org: Organisasjon) => void;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>(
  {} as Context
);

export class OrganisasjonsDetaljerProvider extends Component<{}, State> {
  state: State = {
    antallAnnonser: 0,
    tilgangTilPamState: TilgangPam.LASTER,
    tilgangTilAltinnState: TilgangAltinn.LASTER
  };

  endreOrganisasjon = async (org: Organisasjon) => {
    this.setState({ tilgangTilPamState: TilgangPam.LASTER });
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );
    if (harPamTilgang) {
      this.setState({
        valgtOrganisasjon: org,
        antallAnnonser: await hentAntallannonser(),
        tilgangTilPamState: TilgangPam.TILGANG
      });
    } else {
      this.setState({
        valgtOrganisasjon: org,
        tilgangTilPamState: TilgangPam.IKKE_TILGANG,
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
