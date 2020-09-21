import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    Organisasjon,
    tomAltinnOrganisasjon,
} from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { settBedriftIPamOgReturnerTilgang } from '../api/pamApi';
import hentAntallannonser from '../api/hent-stillingsannonser';
import { Arbeidsavtale, hentArbeidsavtaler, SkjemaMedOrganisasjonerMedTilgang } from '../api/dnaApi';
import { SyfoTilgangContext } from '../SyfoTilgangProvider';
import { Tilgang, tilgangFromTruthy } from './LoginBoundary';
import { OrganisasjonsListeContext } from './OrganisasjonsListeProvider';
import { autentiserAltinnBruker, hentMeldingsboks, Meldingsboks } from '../api/altinnApi';
import { loggSidevisningOgTilgangsKombinasjonAvTjenestebokser } from '../utils/funksjonerForAmplitudeLogging';

interface Props {
    children: React.ReactNode;
}

export interface Tilganger {
    tilgangTilSyfo: Tilgang;
    tilgangTilPam: Tilgang;
    tilgangTilIAWeb: Tilgang;
    tilgangTilArbeidstreningsavtaler: Tilgang;
    tilgangTilArbeidsforhold: Tilgang;
    tilgangTilMidlertidigLonnstilskudd: Tilgang;
    tilgangTilVarigLonnstilskudd: Tilgang;
}

export type Context = {
    endreOrganisasjon: (org: Organisasjon) => void;
    valgtOrganisasjon: Organisasjon;
    antallAnnonser: number;
    arbeidstreningsavtaler: Arbeidsavtale[];
    midlertidigLonnstilskuddAvtaler: Arbeidsavtale[];
    varigLonnstilskuddAvtaler: Arbeidsavtale[];
    tilganger: Tilganger;
    altinnMeldingsboks: Meldingsboks | undefined;
};

export const OrganisasjonsDetaljerContext = React.createContext<Context>({} as Context);

export const OrganisasjonsDetaljerProvider: FunctionComponent<Props> = ({ children }: Props) => {
    const { organisasjonerMedIAWEB, listeMedSkjemaOgTilganger, reporteeMessagesUrls } = useContext(
        OrganisasjonsListeContext
    );
    const tilgangTilSyfo = useContext(SyfoTilgangContext).tilgangTilSyfoState;

    const [antallAnnonser, setantallAnnonser] = useState(-1);

    const [tilgangTilPam, settilgangTilPam] = useState(Tilgang.LASTER);
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

    const [tilganger, setTilganger] = useState<Tilganger>({} as any);

    const endreOrganisasjon = async (org?: Organisasjon) => {
        if (org) {
            //loggBedriftsInfo(org);
            settilgangTilPam(Tilgang.LASTER);
            setTilgangTilIAWeb(Tilgang.LASTER);
            setTilgangTilArbeidstreningsavtaler(Tilgang.LASTER);
            setTilgangTilMidlertidigLonnstilskudd(Tilgang.LASTER);
            setTilgangTilVarigLonnstilskudd(Tilgang.LASTER);
            setTilgangTilArbeidsforhold(Tilgang.LASTER);

            await setValgtOrganisasjon(org);
            const harPamTilgang = await settBedriftIPamOgReturnerTilgang(org.OrganizationNumber);
            if (harPamTilgang) {
                settilgangTilPam(Tilgang.TILGANG);
                setantallAnnonser(await hentAntallannonser());
            } else {
                settilgangTilPam(Tilgang.IKKE_TILGANG);
                setantallAnnonser(0);
            }

            setTilgangTilIAWeb(
                tilgangFromTruthy(
                    organisasjonerMedIAWEB.some(
                        _ => _.OrganizationNumber === org.OrganizationNumber
                    )
                )
            );

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
                        skjema.OrganisasjonerMedTilgang.some(
                            organisasjon =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        )
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
                    const tilgang = skjema.OrganisasjonerMedTilgang.some(
                        organisasjon => organisasjon.OrganizationNumber === org.OrganizationNumber
                    );
                    setTilgangTilArbeidsforhold(tilgangFromTruthy(tilgang));
                }
            });

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
        if (valgtOrganisasjon === tomAltinnOrganisasjon) {
            setTilganger({
                tilgangTilSyfo,
                tilgangTilPam: Tilgang.IKKE_TILGANG,
                tilgangTilIAWeb: Tilgang.IKKE_TILGANG,
                tilgangTilArbeidstreningsavtaler: Tilgang.IKKE_TILGANG,
                tilgangTilArbeidsforhold: Tilgang.IKKE_TILGANG,
                tilgangTilMidlertidigLonnstilskudd: Tilgang.IKKE_TILGANG,
                tilgangTilVarigLonnstilskudd: Tilgang.IKKE_TILGANG,
            });
            if (tilgangTilSyfo === Tilgang.IKKE_TILGANG) {
                loggSidevisningOgTilgangsKombinasjonAvTjenestebokser(null);
            }
        } else {
            setTilganger({
                tilgangTilSyfo,
                tilgangTilPam,
                tilgangTilIAWeb,
                tilgangTilArbeidstreningsavtaler,
                tilgangTilArbeidsforhold,
                tilgangTilMidlertidigLonnstilskudd,
                tilgangTilVarigLonnstilskudd,
            });
        }
    }, [
        tilgangTilSyfo,
        tilgangTilPam,
        tilgangTilIAWeb,
        tilgangTilArbeidstreningsavtaler,
        tilgangTilArbeidsforhold,
        tilgangTilMidlertidigLonnstilskudd,
        tilgangTilVarigLonnstilskudd,
        valgtOrganisasjon,
    ]);

    let defaultContext: Context = {
        antallAnnonser,
        endreOrganisasjon,
        valgtOrganisasjon,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
        tilganger,
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
