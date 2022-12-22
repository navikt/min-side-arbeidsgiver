import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    DigiSyfoOrganisasjon,
    hentOrganisasjoner,
    hentRefusjonstatus,
    hentSyfoVirksomheter,
    RefusjonStatus
} from '../api/dnaApi';
import { autentiserAltinnBruker, hentAltinnRaporteeIdentiteter, ReporteeMessagesUrls } from '../api/altinnApi';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, hentAltinntilganger, hentAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import { SpinnerMedBanner } from './Spinner';
import amplitude from '../utils/amplitude';
import { Organisasjon } from '../altinn/organisasjon';
import { AlertContext } from './Alerts/Alerts';
import * as Sentry from '@sentry/browser';

type orgnr = string;

export type Søknadsstatus =
    { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' }
    | { tilgang: 'ikke søkt' };

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, boolean>;
    altinnsøknad: Record<AltinntjenesteId, Søknadsstatus>;
    syfotilgang: boolean;
    antallSykmeldte: number;
    reporteetilgang: boolean;
    refusjonstatustilgang: boolean;
    refusjonstatus: {
        "KLAR_FOR_INNSENDING"?: number,
    },
};

export enum SyfoTilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
    tilgangTilSyfo: SyfoTilgang;
    visSyfoFeilmelding: boolean;
    harTilganger: boolean;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

const measureAll = (done: (duration: number) => void, ...args: Promise<any>[]) => {
    const started = performance.now()
    Promise.all(args).finally(() => {
        done(performance.now() - started)
    })
}

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = props => {
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<Organisasjon[] | undefined>(undefined);
    const [altinntilganger, setAltinntilganger] = useState<Record<AltinntjenesteId, Set<string>> | undefined>(undefined);
    const [altinnTilgangssøknader, setAltinnTilgangssøknader] = useState<AltinnTilgangssøknad[] | undefined>([]);
    const [reporteeMessagesUrls, setReporteeMessagesUrls] = useState<ReporteeMessagesUrls>({});

    const [syfoVirksomheter, setSyfoVirksomheter] = useState<DigiSyfoOrganisasjon[] | undefined>(undefined);
    const [tilgangTilSyfo, setTilgangTilSyfo] = useState(SyfoTilgang.LASTER);
    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    const [visFeilmelding, setVisFeilmelding] = useState(false);
    const [alleRefusjonsstatus, setAlleRefusjonsstatus] = useState<RefusjonStatus[] | undefined>(undefined);
    const {addAlert} = useContext(AlertContext)
    useEffect(() => {
        measureAll(
            (tidMs) => {
                amplitude.logEvent('komponent-lastet', {
                    komponent: 'OrganisasjonerOgTilgangerProvider',
                    tidMs,
                });
            },
            hentOrganisasjoner()
                .then(orgs => {
                    const gyldigeOrganisasjoner = orgs.filter(
                        org =>
                            org.OrganizationForm === 'BEDR' ||
                            org.OrganizationForm === 'AAFY' ||
                            org.Type === 'Enterprise',
                    );
                    setAltinnorganisasjoner(gyldigeOrganisasjoner);

                    if (gyldigeOrganisasjoner.length !== 0) {
                        hentAltinnRaporteeIdentiteter().then(result => {
                            if (result instanceof Error) {
                                autentiserAltinnBruker(window.location.href);
                                setReporteeMessagesUrls({});
                            } else {
                                setReporteeMessagesUrls(result);
                            }
                        });
                    } else {
                        setReporteeMessagesUrls({});
                    }
                })
                .catch((error) => {
                    Sentry.captureException(error);
                    setAltinnorganisasjoner([]);
                    setVisFeilmelding(true);
                    addAlert('TilgangerAltinn');
                }),
            hentAltinntilganger()
                .then(setAltinntilganger)
                .catch((error) => {
                    Sentry.captureException(error);
                    setAltinntilganger(Record.map(altinntjeneste, () => new Set()));
                }),
            hentAltinnTilgangssøknader()
                .then(setAltinnTilgangssøknader)
                .catch((error) => {
                    Sentry.captureException(error);
                    setAltinnTilgangssøknader([]);
                }),
            hentSyfoVirksomheter()
                .then(virksomheter => {
                    setSyfoVirksomheter(virksomheter);
                    setTilgangTilSyfo(virksomheter.length > 0 ? SyfoTilgang.TILGANG : SyfoTilgang.IKKE_TILGANG);
                    amplitude.setUserProperties({ syfotilgang: virksomheter.length > 0 });
                })
                .catch((error) => {
                    Sentry.captureException(error);
                    setSyfoVirksomheter([]);
                    setVisSyfoFeilmelding(true);
                    setTilgangTilSyfo(SyfoTilgang.IKKE_TILGANG);
                    addAlert('TilgangerDigiSyfo');
                }),
            hentRefusjonstatus()
                .then(refusjonstatus => {
                    setAlleRefusjonsstatus(refusjonstatus);
                })
                .catch((error) => {
                    Sentry.captureException(error);
                    setAlleRefusjonsstatus([]);
                    // har ikke egen alert type på dette, da det mest sannsynlig er altinn som feiler
                    setVisFeilmelding(true);
                    addAlert('TilgangerAltinn');
                }),
        );
    }, []);


    if (altinnorganisasjoner && syfoVirksomheter && altinntilganger && altinnTilgangssøknader && tilgangTilSyfo !== SyfoTilgang.LASTER  && alleRefusjonsstatus !== undefined) {
        const organisasjoner: Record<orgnr, OrganisasjonInfo> = Record.fromEntries(
            [...altinnorganisasjoner, ...syfoVirksomheter.map(({organisasjon}) => organisasjon)].map((org) => {
                const refusjonstatus = alleRefusjonsstatus.find(({virksomhetsnummer}) => virksomhetsnummer === org.OrganizationNumber)
                return [
                    org.OrganizationNumber,
                    {
                        organisasjon: org,
                        altinntilgang:
                            Record.map(altinntilganger, (id: AltinntjenesteId, orgnrMedTilgang: Set<orgnr>): boolean =>
                                orgnrMedTilgang.has(org.OrganizationNumber)
                            ),
                        altinnsøknad: Record.map(altinntilganger,
                            (id: AltinntjenesteId, _orgnrMedTilgang: Set<orgnr>) =>
                                sjekkTilgangssøknader(org.OrganizationNumber, id, _orgnrMedTilgang, altinnTilgangssøknader)
                        ),
                        syfotilgang: syfoVirksomheter.some(({organisasjon}) => organisasjon.OrganizationNumber === org.OrganizationNumber),
                        antallSykmeldte: syfoVirksomheter.find(({organisasjon}) => organisasjon.OrganizationNumber === org.OrganizationNumber)?.antallSykmeldte?? 0,
                        reporteetilgang: altinnorganisasjoner.some(({OrganizationNumber}) => OrganizationNumber === org.OrganizationNumber),
                        refusjonstatus: refusjonstatus?.statusoversikt ?? {},
                        refusjonstatustilgang: refusjonstatus?.tilgang ?? false,
                    }
                ]
            }));

        const harTilganger = Record.values(organisasjoner).some(org => org.organisasjon.ParentOrganizationNumber);

        const context: Context = {
            organisasjoner,
            reporteeMessagesUrls,
            visFeilmelding,
            visSyfoFeilmelding,
            tilgangTilSyfo,
            harTilganger,
        };
        return (
            <OrganisasjonerOgTilgangerContext.Provider value={context}>
                {props.children}
            </OrganisasjonerOgTilgangerContext.Provider>
        );
    } else {
        return (
            <SpinnerMedBanner />
        );
    }
};

const sjekkTilgangssøknader = (
    orgnr: orgnr,
    id: AltinntjenesteId,
    _orgnrMedTilgang: Set<orgnr>,
    altinnTilgangssøknader: AltinnTilgangssøknad[],
): Søknadsstatus => {
    const { tjenestekode, tjenesteversjon } = altinntjeneste[id];
    const søknader = altinnTilgangssøknader.filter(
        s =>
            s.orgnr === orgnr &&
            s.serviceCode === tjenestekode &&
            s.serviceEdition.toString() === tjenesteversjon,
    );

    if (søknader.some(_ => _.status === 'Unopened')) {
        return { tilgang: 'søkt' };
    }

    const søknad = søknader.find(_ => _.status === 'Created');
    if (søknad) {
        return { tilgang: 'søknad opprettet', url: søknad.submitUrl };
    }

    if (søknader.some(_ => _.status === 'Accepted')) {
        return { tilgang: 'godkjent' };
    }
    return { tilgang: 'ikke søkt' };
};
