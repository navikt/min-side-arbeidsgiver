import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import {
    tomAltinnOrganisasjon,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentTiltaksgjennomforingTilgang } from './api/dnaApi';
import { logInfo } from './utils/metricsUtils';
import { SyfoTilgangContext, TilgangSyfo } from './SyfoTilgangProvider';
import { OrganisasjonFraEnhetsregisteret } from './Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentUnderenhet } from './api/enhetsregisteretApi';

export enum TilgangPam {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    tilgangTilPamState: TilgangPam;

    arbeidsavtaler: Array<Arbeidsavtale>;
    harNoenTilganger: boolean;
    tilgangTilSyfoState: TilgangSyfo;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState<number>(0);
    const [tilgangTilPamState, settilgangTilPamState] = useState(TilgangPam.LASTER);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [harNoenTilganger, setHarNoenTilganger] = useState(false);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const endreOrganisasjon = async (org: Organisasjon) => {
        let antallTilganger = 0;
        await setValgtOrganisasjon(org);
        let harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
        if (harPamTilgang) {
            settilgangTilPamState(TilgangPam.TILGANG);
            setantallAnnonser(await hentAntallannonser());
            antallTilganger++;
        } else {
            settilgangTilPamState(TilgangPam.IKKE_TILGANG);
            setantallAnnonser(0);
        }
        setArbeidsavtaler(await hentTiltaksgjennomforingTilgang());

        if (antallTilganger > 0 || tilgangTilSyfoState === TilgangSyfo.TILGANG) {
            setHarNoenTilganger(true);
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
        const hentInfoOmOrg = async () => {
            const informasjon: OrganisasjonFraEnhetsregisteret = await hentUnderenhet(
                valgtOrganisasjon.OrganizationNumber
            );
            logInfo(
                'besok fra organisasjon: ' +
                    valgtOrganisasjon.OrganizationNumber +
                    ' med ' +
                    informasjon.antallAnsatte,
                ' antall ansatte'
            );
        };
        if (valgtOrganisasjon.OrganizationNumber) {
            logInfo(
                'besok fra organisasjon: ' + valgtOrganisasjon.OrganizationNumber,
                valgtOrganisasjon.OrganizationNumber
            );
            hentInfoOmOrg();
        }
    }, [valgtOrganisasjon]);

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
