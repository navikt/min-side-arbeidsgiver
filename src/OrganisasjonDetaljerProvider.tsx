import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import {Arbeidsavtale, hentTiltaksgjennomforingTilgang} from './api/dnaApi';
import { SyfoTilgangContext } from './SyfoTilgangProvider';
import { Tilgang } from './App/LoginBoundary';
import { hentInfoOgLoggInformasjon } from './funksjonerForLogging';
import { logInfo } from './utils/metricsUtils';
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
    arbeidsavtaler: Array<Arbeidsavtale>;
    tilgangTilSyfoState: Tilgang;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);
    const [tilgangTilArbeidsavtaler, setTilgangTilArbeidsavtaler] = useState(Tilgang.LASTER);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { orgMedIAFerdigLastet, organisasjonerMedIAWEB } = useContext(OrganisasjonsListeContext);
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    useEffect(() => {
        setTilgangTilArbeidsavtaler(Tilgang.LASTER);
        const hentArbeidsavtaler = async () => {
            const avtaler: Arbeidsavtale[] = await hentTiltaksgjennomforingTilgang(valgtOrganisasjon);
            setArbeidsavtaler(avtaler);
            if (avtaler.length > 0) {
                setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
            } else {
                setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
            }
        };
        hentArbeidsavtaler()

    }, [valgtOrganisasjon]);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        settilgangTilPamState(Tilgang.LASTER);
        if (org) {
            await setValgtOrganisasjon(org);
            const harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPamState(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
            } else {
                settilgangTilPamState(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
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
        tilgangTilSyfoState,
    };

    return (
        <>
            {tilgangTilSyfoState !== Tilgang.LASTER && (
                <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
                    {children}
                </OrganisasjonsDetaljerContext.Provider>
            )}
        </>
    );
};
