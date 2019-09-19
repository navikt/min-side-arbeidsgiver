import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import {
    tomAltinnOrganisasjon,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentArbeidsforhold, hentTiltaksgjennomforingTilgang } from './api/dnaApi';
import { logInfo } from './utils/metricsUtils';
import { SyfoTilgangContext, TilgangSyfo } from './SyfoTilgangProvider';
import { Mocksrespons, ObjektFraAAregisteret } from './Objekter/Ansatte';

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
    mineAnsatte: ObjektFraAAregisteret;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const [antallAnnonser, setantallAnnonser] = useState<number>(0);
    const [tilgangTilPamState, settilgangTilPamState] = useState(TilgangPam.LASTER);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
    const [mineAnsatte, setMineAnsatte] = useState(Mocksrespons);
    const [harNoenTilganger, setHarNoenTilganger] = useState(false);
    const [arbeidsavtaler, setArbeidsavtaler] = useState(Array<Arbeidsavtale>());
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);

    const endreOrganisasjon = async (org: Organisasjon) => {
        let antallTilganger = 0;
        await setValgtOrganisasjon(org);
        setMineAnsatte(await hentArbeidsforhold());
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
        mineAnsatte,
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
