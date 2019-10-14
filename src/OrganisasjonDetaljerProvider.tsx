import React, { FunctionComponent, useContext, useState } from 'react';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentTiltaksgjennomforingTilgang } from './api/dnaApi';
import { SyfoTilgangContext } from './SyfoTilgangProvider';
import { Tilgang } from './App/LoginBoundary';
import { hentInfoOgLoggInformasjon } from './funksjonerForLogging';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    tilgangTilPamState: Tilgang;
    tilgangTilArbeidsavtaler: Tilgang;

    arbeidsavtaler: Array<Arbeidsavtale>;
    harNoenTilganger: boolean;
    tilgangTilSyfoState: Tilgang;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);
    const [tilgangTilArbeidsavtaler, setTilgangTilArbeidsavtaler] = useState(Tilgang.LASTER);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [harNoenTilganger, setHarNoenTilganger] = useState(false);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        settilgangTilPamState(Tilgang.LASTER);
        setTilgangTilArbeidsavtaler(Tilgang.LASTER);
        if (org) {
            let antallTilganger = 0;
            await setValgtOrganisasjon(org);
            let harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPamState(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
                antallTilganger++;
            } else {
                settilgangTilPamState(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
            }
            setArbeidsavtaler(await hentTiltaksgjennomforingTilgang());
            if (arbeidsavtaler.length > 0) {
                setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
            } else {
                setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
            }

            if (antallTilganger > 0 || tilgangTilSyfoState === Tilgang.TILGANG) {
                setHarNoenTilganger(true);
            }
        }
        hentInfoOgLoggInformasjon(org);
    };

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        tilgangTilPamState,
        tilgangTilArbeidsavtaler,
        valgtOrganisasjon,
        arbeidsavtaler,
        harNoenTilganger,
        tilgangTilSyfoState,
    };

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
