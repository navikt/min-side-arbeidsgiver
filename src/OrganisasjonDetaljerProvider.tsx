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
import { OrganisasjonsListeContext } from './OrganisasjonsListeProvider';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    tilgangTilPamState: Tilgang;
    tilgangTilArbeidsavtaler: Tilgang;
    antallTilganger: number;
    arbeidsavtaler: Array<Arbeidsavtale>;
    tilgangTilSyfoState: Tilgang;
    visIA: boolean;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);
    const [antallTilganger, setAntallTilganger] = useState(0);
    const [tilgangTilArbeidsavtaler, setTilgangTilArbeidsavtaler] = useState(Tilgang.LASTER);
    const { organisasjonerMedIAWEB } = useContext(OrganisasjonsListeContext);
    const [visIA, setVisIA] = useState(false);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        settilgangTilPamState(Tilgang.LASTER);
        setTilgangTilArbeidsavtaler(Tilgang.LASTER);
        setAntallTilganger(0);
        let tilganger: number = 0;
        if (tilgangTilSyfoState === Tilgang.TILGANG) {
            tilganger++;
        }
        if (org) {
            await setValgtOrganisasjon(org);
            let harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPamState(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
                tilganger++;
            } else {
                settilgangTilPamState(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
            }
            setArbeidsavtaler(await hentTiltaksgjennomforingTilgang());
            if (arbeidsavtaler.length > 0) {
                setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
                tilganger++;
            } else {
                setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
            }

            let orgNrIAweb: string[] = organisasjonerMedIAWEB.map(org => org.OrganizationNumber);
            if (orgNrIAweb.includes(valgtOrganisasjon.OrganizationNumber)) {
                setVisIA(true);
                tilganger++;
            } else {
                setVisIA(false);
            }
            setAntallTilganger(tilganger);
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
        tilgangTilSyfoState,
        antallTilganger,
        visIA,
    };

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
