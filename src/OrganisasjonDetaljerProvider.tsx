import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from './api/pamApi';
import hentAntallannonser from './api/hent-stillingsannonser';
import { Arbeidsavtale, hentArbeidsavtaler, SkjemaMedOrganisasjonerMedTilgang } from './api/dnaApi';
import { SyfoTilgangContext } from './SyfoTilgangProvider';
import { Tilgang } from './App/LoginBoundary';
import { OrganisasjonsListeContext } from './OrganisasjonsListeProvider';
import { loggBedriftsInfo } from './utils/funksjonerForAmplitudeLogging';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from './api/altinnApi';

interface Props {
    children: React.ReactNode;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    arbeidstreningsavtaler: Arbeidsavtale[];
    midlertidigLonnstilskuddAvtaler: Arbeidsavtale[];
    varigLonnstilskuddAvtaler: Arbeidsavtale[];
    tilgangsArray: Tilgang[];
    altinnMeldingsboks: Meldingsboks | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const {
        organisasjonerMedIAWEB,
        organisasjonslisteFerdigLastet,
        organisasjonerMedIAFerdigLastet,
        listeMedSkjemaOgTilganger,
        reporteeMessagesUrls,
    } = useContext(OrganisasjonsListeContext);

    const [antallAnnonser, setantallAnnonser] = useState(-1);

    const [tilgangTilPamState, settilgangTilPamState] = useState(Tilgang.LASTER);
    const [tilgangTilArbeidstreningsavtaler, setTilgangTilArbeidstreningsavtaler] = useState(
        Tilgang.LASTER
    );
    const [tilgangTilMidlertidigLonnstilskudd, setTilgangTilMidlertidigLonnstilskudd] = useState(
        Tilgang.LASTER
    );
    const [tilgangTilVarigLonnstilskudd, setTilgangTilVarigLonnstilskudd] = useState(
        Tilgang.LASTER
    );
    const [tilgangTilIAWeb, setTilgangTilIAWeb] = useState(Tilgang.LASTER);
    const [tilgangTilArbeidsforhold, setTilgangTilArbeidsforhold] = useState(Tilgang.LASTER);
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const [tilgangsArray, setTilgangsArray] = useState(Array<Tilgang>());
    const [valgtOrganisasjon, setValgtOrganisasjon] = useState(tomAltinnOrganisasjon);
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

    const endreOrganisasjon = async (org?: Organisasjon) => {
        if (org) {
            loggBedriftsInfo(org);
            settilgangTilPamState(Tilgang.LASTER);
            setTilgangTilIAWeb(Tilgang.LASTER);
            setTilgangTilArbeidstreningsavtaler(Tilgang.LASTER);
            setTilgangTilMidlertidigLonnstilskudd(Tilgang.LASTER);
            setTilgangTilVarigLonnstilskudd(Tilgang.LASTER);
            setTilgangTilArbeidsforhold(Tilgang.LASTER);

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
                if (
                    skjema.Skjema.navn === 'Arbeidstrening' ||
                    skjema.Skjema.navn === 'Midlertidig lønnstilskudd' ||
                    skjema.Skjema.navn === 'Varig lønnstilskudd'
                ) {
                    const tiltaktype =
                        skjema.Skjema.navn === 'Arbeidstrening'
                            ? 'ARBEIDSTRENING'
                            : skjema.Skjema.navn === 'Midlertidig lønnstilskudd'
                            ? 'MIDLERTIDIG_LONNSTILSKUDD'
                            : 'VARIG_LONNSTILSKUDD';
                    if (
                        skjema.OrganisasjonerMedTilgang.filter(
                            (organisasjon: Organisasjon) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        ).length > 0
                    ) {
                        hentArbeidsavtaler(org)
                            .then((avtaler: Arbeidsavtale[]) => {
                                const filtrerteavtaler = avtaler.filter(
                                    (avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype
                                );
                                if (tiltaktype === 'ARBEIDSTRENING') {
                                    setArbeidstreningsavtaler(filtrerteavtaler);
                                    setTilgangTilArbeidstreningsavtaler(Tilgang.TILGANG);
                                } else if (tiltaktype === 'MIDLERTIDIG_LONNSTILSKUDD') {
                                    setMidlertidigLonnstilskuddAvtaler(filtrerteavtaler);
                                    setTilgangTilMidlertidigLonnstilskudd(Tilgang.TILGANG);
                                } else {
                                    setVarigLonnstilskuddAvtaler(filtrerteavtaler);
                                    setTilgangTilVarigLonnstilskudd(Tilgang.TILGANG);
                                }
                            })
                            .catch(_ => {
                                if (tiltaktype === 'ARBEIDSTRENING') {
                                    setArbeidstreningsavtaler([]);
                                    setTilgangTilArbeidstreningsavtaler(Tilgang.IKKE_TILGANG);
                                } else if (tiltaktype === 'MIDLERTIDIG_LONNSTILSKUDD') {
                                    setMidlertidigLonnstilskuddAvtaler([]);
                                    setTilgangTilMidlertidigLonnstilskudd(Tilgang.IKKE_TILGANG);
                                } else {
                                    setVarigLonnstilskuddAvtaler([]);
                                    setTilgangTilVarigLonnstilskudd(Tilgang.IKKE_TILGANG);
                                }
                            });
                    } else {
                        if (tiltaktype === 'ARBEIDSTRENING') {
                            setTilgangTilArbeidstreningsavtaler(Tilgang.IKKE_TILGANG);
                        } else if (tiltaktype === 'MIDLERTIDIG_LONNSTILSKUDD') {
                            setTilgangTilMidlertidigLonnstilskudd(Tilgang.IKKE_TILGANG);
                        } else {
                            setTilgangTilVarigLonnstilskudd(Tilgang.IKKE_TILGANG);
                        }
                    }
                }
                if (skjema.Skjema.navn === 'Arbeidsforhold') {
                    if (
                        skjema.OrganisasjonerMedTilgang.filter(
                            (organisasjon: Organisasjon) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        ).length > 0
                    ) {
                        setTilgangTilArbeidsforhold(Tilgang.TILGANG);
                    } else {
                        setTilgangTilArbeidsforhold(Tilgang.IKKE_TILGANG);
                    }
                }
            });

            if (window.location.search.match('altinnMeldingsboks=true')) {
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
        }
    };

    useEffect(() => {
        const tilgangsArray: Tilgang[] = [
            tilgangTilSyfoState,
            tilgangTilPamState,
            tilgangTilIAWeb,
            tilgangTilArbeidstreningsavtaler,
            tilgangTilArbeidsforhold,
            tilgangTilMidlertidigLonnstilskudd,
            tilgangTilVarigLonnstilskudd,
        ];
        setTilgangsArray(tilgangsArray);
        if (valgtOrganisasjon === tomAltinnOrganisasjon && organisasjonslisteFerdigLastet) {
            setTilgangsArray([
                tilgangTilSyfoState,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
                Tilgang.IKKE_TILGANG,
            ]);
        }
    }, [
        tilgangTilSyfoState,
        tilgangTilPamState,
        tilgangTilIAWeb,
        tilgangTilArbeidstreningsavtaler,
        tilgangTilArbeidsforhold,
        tilgangTilMidlertidigLonnstilskudd,
        tilgangTilVarigLonnstilskudd,
        valgtOrganisasjon,
        organisasjonslisteFerdigLastet,
    ]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
        tilgangsArray,
        altinnMeldingsboks,
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
