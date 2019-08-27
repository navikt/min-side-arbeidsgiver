import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon, tomAltinnOrganisasjon } from './organisasjon';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './hent-stillingsannonser';
import {
  Arbeidsavtale,
  hentMenuToggle,
  hentRoller,
  hentTiltaksgjennomforingTilgang,
  sjekkAltinnRolleForInntekstmelding,
  sjekkAltinnRolleHelseSosial
} from "./api/dnaApi";
import { logInfo } from "./utils/metricsUtils";
import { SyfoTilgangContext, TilgangSyfo,TilgangState } from "./SyfoTilgangProvider";

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
    tilgangTilPamState: TilgangState;
    tilgangTilAltinnForTreSkjemaState: TilgangState;
    tilgangTilAltinnForInntektsmelding: TilgangState;
    arbeidsavtaler: Array<Arbeidsavtale>;
    harNoenTilganger: boolean;
    tilgangArbeidsavtaler: TilgangState;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState<number>(0);
    const [tilgangTilAltinnForTreSkjemaState, settilgangTilAltinnForTreSkjemaState] = useState(
        TilgangState.LASTER
    );
    const [tilgangTilPamState, settilgangTilPamState] = useState(TilgangState.LASTER);
    const [tilgangTilAltinnForInntektsmelding, settilgangTilAltinnForInntektsmelding] = useState(
        TilgangState.LASTER
    );
    const [tilgangArbeidsavtaler, setTilgangArbeidsavtaler] = useState(TilgangState.LASTER);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [harNoenTilganger, setHarNoenTilganger] = useState(false);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

  const endreOrganisasjon = async (org: Organisasjon) => {
    let antallTilganger = 0;
    console.log("endre org kallt med: ", org.Name);
    await setValgtOrganisasjon(org);
    let harPamTilgang = await settBedriftIPamOgReturnerTilgang(
      org.OrganizationNumber
    );
    const fodeslNrMenuToggle: string = await hentMenuToggle(
      "dna.bedriftsvelger.brukNyBedriftsvelger"
    );
    console.log(fodeslNrMenuToggle);

        let roller = await hentRoller(org.OrganizationNumber);
        if (sjekkAltinnRolleForInntekstmelding(roller)) {
            settilgangTilAltinnForInntektsmelding(TilgangState.TILGANG);
            antallTilganger++;
        } else {
            settilgangTilAltinnForInntektsmelding(TilgangState.IKKE_TILGANG);
        }
        if (sjekkAltinnRolleHelseSosial(roller)) {
            settilgangTilAltinnForTreSkjemaState(TilgangState.TILGANG);
            antallTilganger++;
        } else {
            settilgangTilAltinnForTreSkjemaState(TilgangState.IKKE_TILGANG);
        }
        if (harPamTilgang) {
            settilgangTilPamState(TilgangState.TILGANG);
            setantallAnnonser(await hentAntallannonser());
            antallTilganger++;
        } else {
            settilgangTilPamState(TilgangState.IKKE_TILGANG);
        }
        await hentTiltaksgjennomforingTilgang().then(arbeidsavtalerRespons => {
            setArbeidsavtaler(arbeidsavtalerRespons);
            if (arbeidsavtalerRespons.length > 0) {
                setTilgangArbeidsavtaler(TilgangState.TILGANG);
                antallTilganger++;
            } else {
                setTilgangArbeidsavtaler(TilgangState.IKKE_TILGANG);
            }
        });
        if (antallTilganger > 0 || tilgangTilSyfoState === TilgangState.TILGANG) {
            setHarNoenTilganger(true);
        }
        console.log('antall tilganger: ', antallTilganger);
    };

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        tilgangTilAltinnForInntektsmelding,
        tilgangTilAltinnForTreSkjemaState,
        tilgangTilPamState,
        tilgangArbeidsavtaler,
        valgtOrganisasjon,
        arbeidsavtaler,
        harNoenTilganger,
    };

    useEffect(() => {
        if (valgtOrganisasjon.OrganizationNumber) {
            logInfo(
                'besok fra organisasjon: ' + valgtOrganisasjon.OrganizationNumber,
                valgtOrganisasjon.OrganizationNumber
            );
            settilgangTilPamState(TilgangState.LASTER);
            setTilgangArbeidsavtaler(TilgangState.LASTER);
        }
    }, [valgtOrganisasjon]);

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
