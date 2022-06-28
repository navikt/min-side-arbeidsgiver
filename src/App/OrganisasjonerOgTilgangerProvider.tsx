import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    hentOrganisasjoner,
    hentRefusjonstatus,
    hentSyfoTilgang,
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

const syfoTilgangFromTruthy = (tilgang: boolean) =>
    tilgang ? SyfoTilgang.TILGANG : SyfoTilgang.IKKE_TILGANG;

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
    tilgangTilSyfo: SyfoTilgang;
    visSyfoFeilmelding: boolean;
    harTilganger: boolean;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = props => {
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<Organisasjon[] | undefined>(undefined);
    const [altinntilganger, setAltinntilganger] = useState<Record<AltinntjenesteId, Set<string>> | undefined>(undefined);
    const [altinnTilgangssøknader, setAltinnTilgangssøknader] = useState<AltinnTilgangssøknad[] | undefined>([]);
    const [reporteeMessagesUrls, setReporteeMessagesUrls] = useState<ReporteeMessagesUrls>({});

    const [syfoVirksomheter, setSyfoVirksomheter] = useState<Organisasjon[] | undefined>(undefined);
    const [tilgangTilSyfo, setTilgangTilSyfo] = useState(SyfoTilgang.LASTER);
    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    const [visFeilmelding, setVisFeilmelding] = useState(false);
    const [alleRefusjonsstatus, setAlleRefusjonsstatus] = useState<RefusjonStatus[] | undefined>(undefined);
    const {addAlert} = useContext(AlertContext)
    useEffect(() => {
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
            .catch(() => {
                setAltinnorganisasjoner([]);
                setVisFeilmelding(true);
                addAlert("TilgangerAltinn");
            });

        hentAltinntilganger()
            .then(setAltinntilganger)
            .catch(() => setAltinntilganger(Record.map(altinntjeneste, () => new Set())));

        hentAltinnTilgangssøknader()
            .then(setAltinnTilgangssøknader)
            .catch(() => setAltinnTilgangssøknader([]));

        hentSyfoTilgang()
            .then(syfoTilgangFromTruthy)
            .then((syfotilgang) => {
                setTilgangTilSyfo(syfotilgang);
                amplitude.setUserProperties({ syfotilgang: syfotilgang === SyfoTilgang.TILGANG });
            })
            .catch(() => {
                setVisSyfoFeilmelding(true);
                addAlert("TilgangerDigiSyfo");
                setTilgangTilSyfo(SyfoTilgang.IKKE_TILGANG);
            });
        hentSyfoVirksomheter()
            .then(virksomheter => {
                setSyfoVirksomheter(virksomheter);
            })
            .catch(() => {
                setSyfoVirksomheter([]);
                setVisSyfoFeilmelding(true);
                addAlert("TilgangerDigiSyfo");
            });
        hentRefusjonstatus()
            .then(refusjonstatus => {
                setAlleRefusjonsstatus(refusjonstatus);
            })
            .catch(() => {
                setAlleRefusjonsstatus([]);
                // har ikke egen alert type på dette, da det mest sannsynlig er altinn som feiler
                setVisFeilmelding(true);
                addAlert("TilgangerAltinn");
            });
    }, []);


    if (altinnorganisasjoner && syfoVirksomheter && altinntilganger && altinnTilgangssøknader && tilgangTilSyfo !== SyfoTilgang.LASTER  && alleRefusjonsstatus !== undefined) {
        const organisasjoner: Record<orgnr, OrganisasjonInfo> = Record.fromEntries(
            [...altinnorganisasjoner, ...syfoVirksomheter].map((org) => {
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
                        syfotilgang: syfoVirksomheter.some(({OrganizationNumber}) => OrganizationNumber === org.OrganizationNumber),
                        reporteetilgang: altinnorganisasjoner.some(({OrganizationNumber})=> OrganizationNumber === org.OrganizationNumber),
                        refusjonstatus: refusjonstatus?.statusoversikt ?? {},
                        refusjonstatustilgang: refusjonstatus?.tilgang ?? false,
                    }
                ]
            }));

        const detFinnesEnUnderenhetMedParent = () => {
            return Record.values(organisasjoner).some(org => org.organisasjon.ParentOrganizationNumber);
        };
        const harTilganger = detFinnesEnUnderenhetMedParent() && Record.length(organisasjoner) > 0
            || tilgangTilSyfo === SyfoTilgang.TILGANG;

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
