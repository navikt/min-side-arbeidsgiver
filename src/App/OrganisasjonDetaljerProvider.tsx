import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { OrganisasjonerOgTilgangerContext, OrganisasjonInfo } from './OrganisasjonerOgTilgangerProvider';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from '../api/altinnApi';
import { loggBedriftValgtOgTilganger } from '../utils/funksjonerForAmplitudeLogging';
import { hentAntallannonser, settBedriftIPam } from '../api/pamApi';
import { Organisasjon } from '../altinn/organisasjon';
import HovedBanner from './HovedBanner/HovedBanner';
import { ManglerTilgangContainer } from './Hovedside/ManglerTilgangContainer/ManglerTilgangContainer';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    setSidetittel: (sidetittel: string) => void;
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: OrganisasjonInfo;
    antallAnnonser: number;
    altinnMeldingsboks: Meldingsboks | undefined;
};

export const useSidetittel = (sidetittel: string) => {
    const {setSidetittel} = useContext(OrganisasjonsDetaljerContext)
    useEffect(() => {
        setSidetittel(sidetittel)
    }, [setSidetittel, sidetittel])
}

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsVelger: FunctionComponent<Props> = ({ children }: Props) => {
    const [sidetittel, setSidetittel] = useState<string>("Min side – arbeidsgiver")
    const { organisasjoner, reporteeMessagesUrls, visFeilmelding, visSyfoFeilmelding, harTilganger } = useContext(OrganisasjonerOgTilgangerContext);
    const [antallAnnonser, setantallAnnonser] = useState(-1);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(undefined);
    const [altinnMeldingsboks, setAltinnMeldingsboks] = useState<Meldingsboks | undefined>(undefined);

    const endreOrganisasjon = async (org: Organisasjon) => {
        const orgInfo = organisasjoner[org.OrganizationNumber];
        setValgtOrganisasjon(orgInfo);

        if (orgInfo.altinntilgang.pam) {
            settBedriftIPam(orgInfo.organisasjon.OrganizationNumber).then(() =>
                hentAntallannonser().then(setantallAnnonser),
            );
        } else {
            setantallAnnonser(0);
        }
    };

    useEffect(() => {
        if (valgtOrganisasjon !== undefined && valgtOrganisasjon.altinntilgang.tilskuddsbrev) {
            const messagesUrl = reporteeMessagesUrls[valgtOrganisasjon.organisasjon.OrganizationNumber];
            if (messagesUrl === undefined) {
                setAltinnMeldingsboks(undefined);
            } else {
                hentMeldingsboks(messagesUrl)
                    .then(resultat => {
                        if (resultat instanceof Error) {
                            autentiserAltinnBruker(window.location.href);
                            setAltinnMeldingsboks(undefined);
                        } else {
                            setAltinnMeldingsboks(resultat);
                        }
                    });
            }
        } else {
            setAltinnMeldingsboks(undefined);
        }
    }, [valgtOrganisasjon, reporteeMessagesUrls])

    useEffect(() => {
        if (valgtOrganisasjon !== undefined && organisasjoner !== undefined) {
            setValgtOrganisasjon(organisasjoner[valgtOrganisasjon.organisasjon.OrganizationNumber]);
        }
    }, [organisasjoner, valgtOrganisasjon]);

    useEffect(() => {
        loggBedriftValgtOgTilganger(valgtOrganisasjon);
    }, [valgtOrganisasjon]);

    return (<>
        <HovedBanner sidetittel={sidetittel} endreOrganisasjon={endreOrganisasjon}/>
        { !harTilganger && !visFeilmelding && !visSyfoFeilmelding
            ? <ManglerTilgangContainer />
            : null
        }
        { (valgtOrganisasjon === undefined)
            ? null
            : (<OrganisasjonsDetaljerContext.Provider value={{
                    antallAnnonser,
                    endreOrganisasjon,
                    valgtOrganisasjon,
                    altinnMeldingsboks,
                    setSidetittel,
                }}>
                    {children}
                </OrganisasjonsDetaljerContext.Provider>
            )
        }
    </>);
};
