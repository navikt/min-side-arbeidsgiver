import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    hentOrganisasjoner,
    hentSyfoTilgang,
} from '../api/dnaApi';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import {
    autentiserAltinnBruker,
    hentAltinnRaporteeIdentiteter,
    ReporteeMessagesUrls,
} from '../api/altinnApi';
import * as Record from '../utils/Record';
import { Tilgang, tilgangFromTruthy } from './LoginBoundary';
import { AltinnTilgangssøknad, hentAltinntilganger, hentAltinnTilgangssøknader } from '../altinn/tilganger';
import { alleAltinntjenster, AltinnId } from '../altinn/tjenester';

type orgnr = string;
type OrgnrMap<T> = { [orgnr: string]: T };


export type Altinntilgang =
    | {tilgang: 'ja'}
    | {tilgang: 'nei'}
    | {tilgang: 'søknad opprettet', url: string}
    | {tilgang: 'søkt'}
    | {tilgang: 'godkjent'};

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinnSkjematilgang: Record<AltinnId, Altinntilgang>;
};

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
    tilgangTilSyfo: Tilgang;
    visSyfoFeilmelding: boolean;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = props => {
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<OrgnrMap<Organisasjon> | undefined>(
        undefined
    );
    const [altinntilganger, setAltinntilganger] = useState<
        Record<AltinnId, Set<string>> | undefined
        >(undefined);
    const [visFeilmelding, setVisFeilmelding] = useState(false);
    const [reporteeMessagesUrls, setReporteeMessagesUrls] = useState<ReporteeMessagesUrls>({});
    const [tilgangTilSyfo, setTilgangTilSyfo] = useState(Tilgang.LASTER);
    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    const [altinnTilgangssøknader, setAltinnTilgangssøknader] = useState<
        AltinnTilgangssøknad[] | undefined
    >(undefined);

    useEffect(() => {
        /* Kjører denne først, fordi den kan føre til en redirect til Altinn. */
        hentAltinnRaporteeIdentiteter().then(result => {
            if (result instanceof Error) {
                autentiserAltinnBruker(window.location.href);
                setReporteeMessagesUrls({});
            } else {
                setReporteeMessagesUrls(result);
            }
        });

        hentOrganisasjoner()
            .then(orgs =>
                orgs.filter(
                    org =>
                        org.OrganizationForm === 'BEDR' ||
                        org.OrganizationForm === 'AAFY' ||
                        org.Type === 'Enterprise'
                )
            )
            .then(orgs => Record.fromEntries(orgs.map(org => [org.OrganizationNumber, org])))
            .then(setAltinnorganisasjoner)
            .catch(() => {
                setAltinnorganisasjoner({});
                setVisFeilmelding(true);
            });

        hentAltinntilganger()
            .then(setAltinntilganger)
            .catch(() => setAltinntilganger(Record.map(alleAltinntjenster, () => new Set())))

        hentAltinnTilgangssøknader()
            .then(setAltinnTilgangssøknader)
            .catch(() => setAltinnTilgangssøknader([]))

        hentSyfoTilgang()
            .then(tilgangFromTruthy)
            .then(setTilgangTilSyfo)
            .catch(() => {
                setVisSyfoFeilmelding(true);
                setTilgangTilSyfo(Tilgang.IKKE_TILGANG);
            }) ;
    }, []);

    if (altinnorganisasjoner && altinntilganger && altinnTilgangssøknader) {
        const sjekkTilgang = (orgnr: orgnr) => (id: AltinnId, orgnrMedTilgang: Set<orgnr>): Altinntilgang => {
            if (orgnrMedTilgang.has(orgnr)) {
                return {tilgang: 'ja'};
            }
            const { tjenestekode, tjenesteversjon } = alleAltinntjenster[id]
            const søknader = altinnTilgangssøknader.filter(s =>
                s.orgnr === orgnr &&
                s.serviceCode === tjenestekode &&
                s.serviceEdition.toString() === tjenesteversjon
            );

            if (søknader.some(_ => _.status === 'Unopened')) {
                return {tilgang: 'søkt'};
            }

            const søknad = søknader.find(_ => _.status === 'Created');
            if (søknad) {
                return {tilgang: 'søknad opprettet', url: søknad.submitUrl};
            }

            if (søknader.some(_ => _.status === 'Accepted')) {
                return {tilgang: 'godkjent'}
            }

            return {tilgang: 'nei'};
        };

        const organisasjoner = Record.map(altinnorganisasjoner, (orgnr, org) => ({
                organisasjon: org,
                altinnSkjematilgang: Record.map(altinntilganger, sjekkTilgang(orgnr))
            }));

        const context: Context = {
            organisasjoner,
            reporteeMessagesUrls,
            visFeilmelding,
            visSyfoFeilmelding,
            tilgangTilSyfo,
        };

        return (
            <OrganisasjonerOgTilgangerContext.Provider value={context}>
                {props.children}
            </OrganisasjonerOgTilgangerContext.Provider>
        );
    } else {
        return <></>;
    }
};
