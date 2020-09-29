import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import hentAntallannonser from '../api/hent-stillingsannonser';
import { Arbeidsavtale, hentArbeidsavtaler } from '../api/dnaApi';
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
    arbeidstreningsavtaler: Arbeidsavtale[];
    midlertidigLonnstilskuddAvtaler: Arbeidsavtale[];
    varigLonnstilskuddAvtaler: Arbeidsavtale[];
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
    const [arbeidstreningsavtaler, setArbeidstreningsavtaler] = useState(Array<Arbeidsavtale>());
    const [midlertidigLonnstilskuddAvtaler, setMidlertidigLonnstilskuddAvtaler] = useState(
        Array<Arbeidsavtale>()
    );
    const [varigLonnstilskuddAvtaler, setVarigLonnstilskuddAvtaler] = useState(
        Array<Arbeidsavtale>()
    );

    const endreOrganisasjon = async (org: Organisasjon) => {
        const orgInfo = organisasjoner[org.OrganizationNumber];
        setValgtOrganisasjon(orgInfo);

        if (orgInfo.altinnSkjematilgang.pam) {
            setantallAnnonser(await hentAntallannonser());
        } else {
            setantallAnnonser(0);
        }

        const tilgangArbeidstrening = orgInfo.altinnSkjematilgang.arbeidstrening;
        const tilgangVarigLønnstilskudd = orgInfo.altinnSkjematilgang.varigLønnstilskudd;
        const tilgangMidlertidigLønnstilskudd =
            orgInfo.altinnSkjematilgang.midlertidigLønnstilskudd;

        if (tilgangArbeidstrening || tilgangMidlertidigLønnstilskudd || tilgangVarigLønnstilskudd) {
            hentArbeidsavtaler(org)
                .then((avtaler: Arbeidsavtale[]) => {
                    const avtalerMedTiltaktype = (tiltaktype: string) =>
                        avtaler.filter(
                            (avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype
                        );
                    setArbeidstreningsavtaler(avtalerMedTiltaktype('ARBEIDSTRENING'));
                    setMidlertidigLonnstilskuddAvtaler(
                        avtalerMedTiltaktype('MIDLERTIDIG_LONNSTILSKUDD')
                    );
                    setVarigLonnstilskuddAvtaler(avtalerMedTiltaktype('VARIG_LONNSTILSKUDD'));
                })
                .catch(_ => {
                    setArbeidstreningsavtaler([]);
                    setMidlertidigLonnstilskuddAvtaler([]);
                    setVarigLonnstilskuddAvtaler([]);
                });
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
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
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
