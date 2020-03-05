import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentTiltaksgjennomforingTilgang } from './api/dnaApi';
import { SyfoTilgangContext } from './SyfoTilgangProvider';
import { Tilgang } from './App/LoginBoundary';
import { OrganisasjonsListeContext } from './OrganisasjonsListeProvider';
import { loggBedriftsInfo } from './utils/funksjonerForAmplitudeLogging';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    arbeidsavtaler: Array<Arbeidsavtale>;
    tilgangsArray: Tilgang[];
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState(-1);

    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);
    const [tilgangTilArbeidsavtaler, setTilgangTilArbeidsavtaler] = useState(Tilgang.LASTER);
    const [tilgangTilIAWeb, setTilgangTilIAWeb] = useState(Tilgang.LASTER);
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());

    const [tilgangsArray, setTilgangsArray] = useState(Array<Tilgang>());
    const {
        organisasjonerMedIAWEB,
        organisasjonslisteFerdigLastet,
        organisasjonerMedIAFerdigLastet,
    } = useContext(OrganisasjonsListeContext);

    useEffect(() => {
        setTilgangTilArbeidsavtaler(Tilgang.LASTER);
        if (valgtOrganisasjon !== tomAltinnOrganisasjon) {
            const hentArbeidsavtaler = async () => {
                const avtaler: Arbeidsavtale[] = await hentTiltaksgjennomforingTilgang(
                    valgtOrganisasjon
                );
                setArbeidsavtaler(avtaler);
                if (avtaler.length > 0) {
                    setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
                } else {
                    setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
                }
            };
            hentArbeidsavtaler();
        }
    }, [valgtOrganisasjon]);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        if (org) {
            loggBedriftsInfo(org);
            settilgangTilPamState(Tilgang.LASTER);
            setTilgangTilIAWeb(Tilgang.LASTER);
            await setValgtOrganisasjon(org);
            const harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPamState(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
            } else {
                settilgangTilPamState(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
            }
            if (organisasjonerMedIAFerdigLastet) {
                const orgNrIAweb: string[] = organisasjonerMedIAWEB.map(
                    org => org.OrganizationNumber
                );
                if (orgNrIAweb.includes(org.OrganizationNumber)) {
                    setTilgangTilIAWeb(Tilgang.TILGANG);
                } else {
                    setTilgangTilIAWeb(Tilgang.IKKE_TILGANG);
                }
            }
        }
    };

    useEffect(() => {
        const tilgangsArray: Tilgang[] = [
            tilgangTilSyfoState,
            tilgangTilPamState,
            tilgangTilIAWeb,
            tilgangTilArbeidsavtaler,
        ];
        setTilgangsArray(tilgangsArray);
        if (valgtOrganisasjon === tomAltinnOrganisasjon && organisasjonslisteFerdigLastet) {
            setTilgangsArray([
                tilgangTilSyfoState,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
            ]);
        }
    }, [
        tilgangTilSyfoState,
        tilgangTilPamState,
        tilgangTilIAWeb,
        tilgangTilArbeidsavtaler,
        valgtOrganisasjon,
        organisasjonslisteFerdigLastet,
    ]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        arbeidsavtaler,
        tilgangsArray,
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
