import React, { FunctionComponent, useState } from "react";
import { tomAltinnOrganisasjon, Organisasjon } from "./organisasjon";
import { settBedriftIPamOgReturnerTilgang } from "./api/pamApi";
import hentAntallannonser from "./hent-stillingsannonser";
import {
  Arbeidsavtale,
  hentRoller,
  hentTiltaksgjennomforingTilgang,
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

interface Props {
  children: React.ReactNode;
}

export type Context = {
  endreOrganisasjon: (org: Organisasjon) => void;
  valgtOrganisasjon: Organisasjon;
  antallAnnonser: number;
  tilgangTilPamState: TilgangPam;
  tilgangTilAltinnForTreSkjemaState: TilgangAltinn;
  tilgangTilAltinnForInntektsmelding: TilgangAltinn;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>(
  {} as Context
);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({
  children
}: Props) => {
  const [antallAnnonser, setantallAnnonser] = useState<number>(0);
  const [
    tilgangTilAltinnForTreSkjemaState,
    settilgangTilAltinnForTreSkjemaState
  ] = useState(TilgangAltinn.LASTER);
  const [tilgangTilPamState, settilgangTilPamState] = useState(
    TilgangPam.LASTER
  );
  const [
    tilgangTilAltinnForInntektsmelding,
    settilgangTilAltinnForInntektsmelding
  ] = useState(TilgangAltinn.LASTER);
  const [valgtOrganisasjon, setValgtOrganisasjon] = useState(
    tomAltinnOrganisasjon
  );

  const endreOrganisasjon = async (org: Organisasjon) => {
    await setValgtOrganisasjon(org);
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );

    let roller = await hentRoller(org.OrganizationNumber);
    if (sjekkAltinnRolleForInntekstmelding(roller)) {
      settilgangTilAltinnForInntektsmelding(TilgangAltinn.TILGANG);
    } else {
      settilgangTilAltinnForInntektsmelding(TilgangAltinn.IKKE_TILGANG);
    }
    if (sjekkAltinnRolleHelseSosial(roller)) {
      settilgangTilAltinnForTreSkjemaState(TilgangAltinn.TILGANG);
    } else {
      settilgangTilAltinnForTreSkjemaState(TilgangAltinn.IKKE_TILGANG);
    }
    if (harPamTilgang) {
      settilgangTilPamState(TilgangPam.TILGANG);
      setantallAnnonser(await hentAntallannonser());
    } else {
      settilgangTilPamState(TilgangPam.IKKE_TILGANG);
      setantallAnnonser(0);
    }
    const arbeidsavtaler: Array<
      Arbeidsavtale
    > = await hentTiltaksgjennomforingTilgang();
    console.log(arbeidsavtaler);
  };

  let defaultContext: Context = {
    antallAnnonser,
    endreOrganisasjon,
    tilgangTilAltinnForInntektsmelding,
    tilgangTilAltinnForTreSkjemaState,
    tilgangTilPamState,
    valgtOrganisasjon
  };

  return (
    <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
      {children}
    </OrganisasjonsDetaljerContext.Provider>
  );
};
