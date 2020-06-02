import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon, tomAltinnOrganisasjon, } from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import {
    Arbeidsavtale,
    hentTiltaksgjennomforingTilgang,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
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
    const [tilgangTilArbeidsforhold, setTilgangTilArbeidsforhold] = useState(Tilgang.LASTER);
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());

    const [tilgangsArray, setTilgangsArray] = useState(Array<Tilgang>());
    const {
        organisasjonerMedIAWEB,
        organisasjonslisteFerdigLastet,
        organisasjonerMedIAFerdigLastet,
        listeMedSkjemaOgTilganger,
    } = useContext(OrganisasjonsListeContext);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        if (org) {
            loggBedriftsInfo(org);
            settilgangTilPamState(Tilgang.LASTER);
            setTilgangTilIAWeb(Tilgang.LASTER);
            setTilgangTilArbeidsavtaler(Tilgang.LASTER);
            setTilgangTilArbeidsforhold(Tilgang.LASTER);
            await setValgtOrganisasjon(org);
            const harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPamState(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
            } else {
                settilgangTilPamState(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
            }
            if (organisasjonerMedIAFerdigLastet !== Tilgang.LASTER) {
                const orgNrIAweb: string[] = organisasjonerMedIAWEB.map(
                    org => org.OrganizationNumber
                );
                if (orgNrIAweb.includes(org.OrganizationNumber)) {
                    setTilgangTilIAWeb(Tilgang.TILGANG);
                } else {
                    setTilgangTilIAWeb(Tilgang.IKKE_TILGANG);
                }
            }
            listeMedSkjemaOgTilganger.forEach((skjema: SkjemaMedOrganisasjonerMedTilgang) => {
                if (skjema.Skjema.navn === 'Tiltaksgjennomforing') {
                    if (
                        skjema.OrganisasjonerMedTilgang.filter(
                            (organisasjon: Organisasjon) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        ).length === 0
                    ) {
                        setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
                    } else {
                        hentTiltaksgjennomforingTilgang(org)
                            .then(avtaler => {
                                setArbeidsavtaler(avtaler);
                                setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
                            })
                            .catch(e => {
                                setArbeidsavtaler([]);
                                setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
                            });
                    }
                }
                if (skjema.Skjema.navn === 'Arbeidsforhold') {
                    if (
                        skjema.OrganisasjonerMedTilgang.filter(
                            (organisasjon: Organisasjon) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        ).length > 0
                    ) {
                        setTilgangTilArbeidsforhold(Tilgang.TILGANG);
                    } else {
                        setTilgangTilArbeidsforhold(Tilgang.IKKE_TILGANG);
                        // console.log('Har ikke tilgang til arbeidsforhold');
                    }
                }
            });
        }
    };

    useEffect(() => {
        const tilgangsArray: Tilgang[] = [
            tilgangTilSyfoState,
            tilgangTilPamState,
            tilgangTilIAWeb,
            tilgangTilArbeidsavtaler,
            tilgangTilArbeidsforhold,
        ];
        setTilgangsArray(tilgangsArray);
        if (valgtOrganisasjon === tomAltinnOrganisasjon && organisasjonslisteFerdigLastet) {
            setTilgangsArray([
                tilgangTilSyfoState,
                Tilgang.IKKE_TILGANG,
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
        tilgangTilArbeidsforhold,
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
