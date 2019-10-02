import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import {
    tomAltinnOrganisasjon,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentTiltaksgjennomforingTilgang, tomAvtale } from './api/dnaApi';
import { logInfo } from './utils/metricsUtils';
import { SyfoTilgangContext, Tilgang } from './SyfoTilgangProvider';
interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    tilgangTilPamState: Tilgang;

    arbeidsavtaler: Array<Arbeidsavtale>;
    harNoenTilganger: boolean;
    tilgangTilSyfoState: Tilgang;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [harNoenTilganger, setHarNoenTilganger] = useState(false);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        settilgangTilPamState(Tilgang.LASTER);
        setantallAnnonser(-1);
        setArbeidsavtaler([tomAvtale]);
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

            if (antallTilganger > 0 || tilgangTilSyfoState === Tilgang.TILGANG) {
                setHarNoenTilganger(true);
            }
        }
    };

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        tilgangTilPamState,
        valgtOrganisasjon,
        arbeidsavtaler,
        harNoenTilganger,
        tilgangTilSyfoState,
    };

    useEffect(() => {
        if (valgtOrganisasjon.OrganizationNumber) {
            logInfo(
                'besok fra organisasjon: ' + valgtOrganisasjon.OrganizationNumber,
                valgtOrganisasjon.OrganizationNumber
            );
        }
    }, [valgtOrganisasjon]);

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
