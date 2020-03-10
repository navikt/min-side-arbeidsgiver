import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Organisasjon, tomAltinnOrganisasjon} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import {settBedriftIPamOgReturnerTilgang} from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import {Arbeidsavtale, hentTiltaksgjennomforingTilgang, SkjemaMedOrganisasjonerMedTilgang} from './api/dnaApi';
import {SyfoTilgangContext} from './SyfoTilgangProvider';
import {Tilgang} from './App/LoginBoundary';
import {OrganisasjonsListeContext} from './OrganisasjonsListeProvider';
import {loggBedriftsInfo} from './utils/funksjonerForAmplitudeLogging';

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
        listeMedSkjemaOgTilganger
    } = useContext(OrganisasjonsListeContext);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        console.log("endre org kallt");
        if (org) {
            loggBedriftsInfo(org);
            settilgangTilPamState(Tilgang.LASTER);
            setTilgangTilIAWeb(Tilgang.LASTER);
            setTilgangTilArbeidsavtaler(Tilgang.LASTER);
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
                    if (skjema.OrganisasjonerMedTilgang.filter((organisasjon: Organisasjon) => organisasjon.OrganizationNumber === valgtOrganisasjon.OrganizationNumber).length === 0) {
                        setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
                        console.log("dette skjer: tror de ikke har tilgang")
                    } else {
                        hentTiltaksgjennomforingTilgang(
                            valgtOrganisasjon
                        ).then(avtaler => {
                            setArbeidsavtaler(avtaler);
                            setTilgangTilArbeidsavtaler(Tilgang.TILGANG);
                        }).catch(e => {
                            setArbeidsavtaler([]);
                            setTilgangTilArbeidsavtaler(Tilgang.IKKE_TILGANG);
                        });
                    }
                }
                ;
            });
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