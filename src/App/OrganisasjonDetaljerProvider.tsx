import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import hentAntallannonser from '../api/hent-stillingsannonser';
import { Tilgang } from './LoginBoundary';
import { OrganisasjonInfo, OrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerProvider';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from '../api/altinnApi';
import { loggSidevisningOgTilgangsKombinasjonAvTjenestebokser } from '../utils/funksjonerForAmplitudeLogging';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo | undefined;
    antallAnnonser: number;
    altinnMeldingsboks: Meldingsboks | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner, reporteeMessagesUrls, tilgangTilSyfo } = useContext(
        OrganisasjonerOgTilgangerContext
    );

    const [antallAnnonser, setantallAnnonser] = useState(-1);

    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(
        undefined
    );
    const [altinnMeldingsboks, setAltinnMeldingsboks] = useState<Meldingsboks | undefined>(
        undefined
    );

    const endreOrganisasjon = async (org: Organisasjon) => {
        const orgInfo = organisasjoner[org.OrganizationNumber];
        setValgtOrganisasjon(orgInfo);

        if (orgInfo.altinnSkjematilgang.pam) {
            setantallAnnonser(await hentAntallannonser());
        } else {
            setantallAnnonser(0);
        }

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
    };

    useEffect(() => {
        if (tilgangTilSyfo !== Tilgang.LASTER) {
            loggSidevisningOgTilgangsKombinasjonAvTjenestebokser(valgtOrganisasjon, {
                tilgangTilSyfo,
            });
        }
    }, [valgtOrganisasjon, tilgangTilSyfo]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        altinnMeldingsboks,
    };

    return (
        <>
            {tilgangTilSyfo !== Tilgang.LASTER && (
                <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
                    {children}
                </OrganisasjonsDetaljerContext.Provider>
            )}
        </>
    );
};
