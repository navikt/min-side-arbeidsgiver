import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import hentAntallannonser from "./hent-stillingsannonser";
import { settBedriftIPamOgReturnerTilgang } from "./api/pamApi";
import { hentBedriftsInfo } from "./api/enhetsregisteretApi";
import { EnhetsregisteretOrg } from "./enhetsregisteretOrg";

export enum TilgangPam {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

interface State {
  valgtOrganisasjon?: Organisasjon;
  antallAnnonser: number;
  tilgangTilPamState: TilgangPam;
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
    antallAnnonser: 0,
    tilgangTilPamState: TilgangPam.LASTER
  };

  endreOrganisasjon = async (org: Organisasjon) => {
    this.setState({ tilgangTilPamState: TilgangPam.LASTER });
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );
    let bedriftinfo: EnhetsregisteretOrg = await hentBedriftsInfo("889640782");
    console.log("postadresse: ", bedriftinfo.postadresse);
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
