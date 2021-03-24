import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { OrganisasjonInfo, OrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerProvider';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from '../api/altinnApi';
import { loggSidevisningOgTilgangsKombinasjonAvTjenestebokser } from '../utils/funksjonerForAmplitudeLogging';
import { settBedriftIPam, hentAntallannonser } from '../api/pamApi';
import { hentVarsler, Varsel } from '../api/varslerApi';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo | undefined;
    antallAnnonser: number;
    altinnMeldingsboks: Meldingsboks | undefined;
    varsler: Varsel[] | undefined;
    antallUlesteVarsler: number;
    setAntallUlesteVarsler: (num: number) => void;
    tidspunktHentVarsler: string;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner, reporteeMessagesUrls, tilgangTilSyfo } = useContext(OrganisasjonerOgTilgangerContext);
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(undefined);
    const [altinnMeldingsboks, setAltinnMeldingsboks] = useState<Meldingsboks | undefined>(undefined);

    const [varsler, setVarsler] = useState<Varsel[] | undefined>(undefined);
    const [antallUlesteVarsler, setAntallUlesteVarsler] = useState<number>(0);
    const [tidspunktHentVarsler, setTidspunktHentVarsler] = useState<string>('');

    const finnAntallUlesteVarsler = (varsler: Varsel[]): number => {
        //return varsler.filter((varsel) => !varsel.lest).length;
        return 0
    };

    const endreOrganisasjon = async (org: Organisasjon) => {
        const orgInfo = organisasjoner[org.OrganizationNumber];
        setValgtOrganisasjon(orgInfo);

        if (orgInfo.altinntilgang.pam.tilgang === 'ja') {
            settBedriftIPam(orgInfo.organisasjon.OrganizationNumber).then(() =>
                hentAntallannonser().then(setantallAnnonser)
            );
        } else {
            setantallAnnonser(0);
        }

        hentVarsler()
            .then((varsler: Varsel[]) => {
                console.log("Varsler hentet: ", varsler);
                setTidspunktHentVarsler('12345');
                setVarsler(varsler);
                setAntallUlesteVarsler(finnAntallUlesteVarsler(varsler));
            })
            .catch(() => {
                setVarsler(undefined);
            });

        if (orgInfo.altinntilgang.tilskuddsbrev.tilgang === 'ja') {
            const messagesUrl = reporteeMessagesUrls[org.OrganizationNumber];
            if (messagesUrl === undefined) {
                setAltinnMeldingsboks(undefined);
            } else {
                const resultat = await hentMeldingsboks(messagesUrl);
                if (resultat instanceof Error) {
                    autentiserAltinnBruker(window.location.href);
                    setAltinnMeldingsboks(undefined);
                } else {
                    setAltinnMeldingsboks(resultat);
                }
            }
        }
    };

    useEffect(() => {
        loggSidevisningOgTilgangsKombinasjonAvTjenestebokser(valgtOrganisasjon, { tilgangTilSyfo });
    }, [valgtOrganisasjon, tilgangTilSyfo]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        altinnMeldingsboks,
        varsler,
        antallUlesteVarsler,
        setAntallUlesteVarsler,
        tidspunktHentVarsler,
    };

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
