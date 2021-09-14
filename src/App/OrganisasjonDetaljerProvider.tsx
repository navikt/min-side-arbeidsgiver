import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Organisasjon} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import {OrganisasjonerOgTilgangerContext, OrganisasjonInfo} from './OrganisasjonerOgTilgangerProvider';
import {autentiserAltinnBruker, hentMeldingsboks, Meldingsboks} from '../api/altinnApi';
import {loggBedriftValgtOgTilganger} from '../utils/funksjonerForAmplitudeLogging';
import {hentAntallannonser, settBedriftIPam} from '../api/pamApi';

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

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({children}: Props) => {
    const {organisasjoner, reporteeMessagesUrls} = useContext(OrganisasjonerOgTilgangerContext);
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(undefined);
    const [altinnMeldingsboks, setAltinnMeldingsboks] = useState<Meldingsboks | undefined>(undefined);

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
        if (valgtOrganisasjon !== undefined && organisasjoner !== undefined) {
            setValgtOrganisasjon(organisasjoner[valgtOrganisasjon.organisasjon.OrganizationNumber]);
        }
    }, [organisasjoner, valgtOrganisasjon]);

    useEffect(() => {
        loggBedriftValgtOgTilganger(valgtOrganisasjon);
    }, [valgtOrganisasjon]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        altinnMeldingsboks,
    };

    return (
        <OrganisasjonsDetaljerContext.Provider value={defaultContext}>
            {children}
        </OrganisasjonsDetaljerContext.Provider>
    );
};
