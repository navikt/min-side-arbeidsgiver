import React, { Component } from "react";
import { Organisasjon } from "./organisasjon";
import { settBedriftIPamOgReturnerTilgang } from "./api/pamApi";
import hentAntallannonser from "./hent-stillingsannonser";
import {
  hentRoller,
  hentRollerOgSjekkTilgang,
  sjekkAltinnRolleForInntekstmelding,
  sjekkAltinnRolleHelseSosial
} from "./api/dnaApi";

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
  tilgangTilAltinnForTreSkjemaState: TilgangAltinn;
  tilgangTilAltinnForInntektsmelding: TilgangAltinn;
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
    tilgangTilAltinnForTreSkjemaState: TilgangAltinn.LASTER,
    tilgangTilAltinnForInntektsmelding: TilgangAltinn.LASTER
  };

  endreOrganisasjon = async (org: Organisasjon) => {
    this.setState({ tilgangTilPamState: TilgangPam.LASTER });
    this.setState({ tilgangTilAltinnForTreSkjemaState: TilgangAltinn.LASTER });
    this.setState({ tilgangTilAltinnForInntektsmelding: TilgangAltinn.LASTER });
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );
    let roller = await hentRoller(org.OrganizationNumber);
    if (sjekkAltinnRolleForInntekstmelding(roller)) {
      this.setState({
        tilgangTilAltinnForInntektsmelding: TilgangAltinn.TILGANG
      });
    } else {
      this.setState({
        tilgangTilAltinnForInntektsmelding: TilgangAltinn.IKKE_TILGANG
      });
    }
    if (sjekkAltinnRolleHelseSosial(roller)) {
      this.setState({
        tilgangTilAltinnForTreSkjemaState: TilgangAltinn.TILGANG
      });
    } else {
      this.setState({
        tilgangTilAltinnForTreSkjemaState: TilgangAltinn.IKKE_TILGANG
      });
    }
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
