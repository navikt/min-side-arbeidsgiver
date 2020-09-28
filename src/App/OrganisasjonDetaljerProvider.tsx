import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from '../api/pamApi';
import hentAntallannonser from '../api/hent-stillingsannonser';
import { Arbeidsavtale, hentArbeidsavtaler } from '../api/dnaApi';
import { Tilgang } from './LoginBoundary';
import { OrganisasjonInfo, OrganisasjonsListeContext } from './OrganisasjonsListeProvider';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from '../api/altinnApi';
import {
    loggIngenTilganger,
} from '../utils/funksjonerForAmplitudeLogging';

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
    tilgangTilPam: Tilgang;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjoner, reporteeMessagesUrls, tilgangTilSyfo } = useContext(
        OrganisasjonsListeContext
    );

    const [antallAnnonser, setantallAnnonser] = useState(-1);

    const [tilgangTilPam, settilgangTilPam] = useState(Tilgang.LASTER);
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState<OrganisasjonInfo | undefined>(undefined);
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
        const orgInfo = organisasjoner[org.OrganizationNumber]
        setValgtOrganisasjon(orgInfo);
        settilgangTilPam(Tilgang.LASTER);

        const harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
        if (harPamTilgang) {
            settilgangTilPam(Tilgang.TILGANG);
            setantallAnnonser(await hentAntallannonser());
        } else {
            settilgangTilPam(Tilgang.IKKE_TILGANG);
            setantallAnnonser(0);
        }

        const tilgangArbeidstrening = orgInfo.altinnSkjematilgang.Arbeidstrening;
        const tilgangVarigLønnstilskudd = orgInfo.altinnSkjematilgang['Varig lønnstilskudd'];
        const tilgangMidlertidigLønnstilskudd = orgInfo.altinnSkjematilgang['Midlertidig lønnstilskudd'];

        if (tilgangArbeidstrening || tilgangMidlertidigLønnstilskudd || tilgangVarigLønnstilskudd) {
            hentArbeidsavtaler(org)
                .then((avtaler: Arbeidsavtale[]) => {
                    const avtalerMedTiltaktype = (tiltaktype: string) => avtaler.filter(
                        (avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype
                    );
                    setArbeidstreningsavtaler(avtalerMedTiltaktype('ARBEIDSTRENING'));
                    setMidlertidigLonnstilskuddAvtaler(avtalerMedTiltaktype('MIDLERTIDIG_LONNSTILSKUDD'));
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
        if (valgtOrganisasjon === undefined) {
            settilgangTilPam(Tilgang.IKKE_TILGANG);

            if (tilgangTilSyfo === Tilgang.IKKE_TILGANG) {
                loggIngenTilganger()
            }
        }
    }, [
        valgtOrganisasjon,
        tilgangTilSyfo,
    ]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
        altinnMeldingsboks,
        tilgangTilPam,
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
