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
import {logError, logInfo} from './utils/metricsUtils';
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

    const endreOrganisasjon = async (org?: Organisasjon) => {
        const loggTilganger = (org: Organisasjon) => {
            logInfo('tilgang til PAM: ' + tilgangTilPamState.toString());
            logInfo('tilgang til Syfo: ' + tilgangTilSyfoState.toString());
            logInfo('tilgang til Arbeidsavtaler: ' + tilgangTilArbeidsavtaler.toString());
            if (organisasjonerMedIAWEB.includes(org)) {
                logInfo('tilgang til IA-web: 2');
            }
        };
        settilgangTilPamState(Tilgang.LASTER);
        setTilgangTilArbeidsavtaler(Tilgang.LASTER);
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
            try {
                setArbeidsavtaler(await hentTiltaksgjennomforingTilgang());
            }catch(e){
                logError(e);
            }
            if (arbeidsavtaler.length > 0) {
                setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
            } else {
                setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
            }
            if (
                tilgangTilArbeidsavtaler !== Tilgang.LASTER &&
                tilgangTilSyfoState !== Tilgang.LASTER &&
                tilgangTilPamState !== Tilgang.LASTER &&
                orgMedIAFerdigLastet !== Tilgang.LASTER
            ) {
                loggTilganger(org);
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
