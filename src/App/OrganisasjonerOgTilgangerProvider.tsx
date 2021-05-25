import React, { FunctionComponent, useEffect, useState } from 'react';
import { hentOrganisasjoner, hentSyfoTilgang } from '../api/dnaApi';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { autentiserAltinnBruker, hentAltinnRaporteeIdentiteter, ReporteeMessagesUrls } from '../api/altinnApi';
import * as Record from '../utils/Record';
import { Tilgang, tilgangFromTruthy } from './LoginBoundary';
import { AltinnTilgangssøknad, hentAltinntilganger, hentAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import Spinner from './Spinner';

type orgnr = string;
type OrgnrMap<T> = { [orgnr: string]: T };

export type Altinntilgang =
    | { tilgang: 'ja' }
    | { tilgang: 'nei' }
    | { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' };

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, Altinntilgang>;
};

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
    tilgangTilSyfo: Tilgang;
    visSyfoFeilmelding: boolean;
    harTilganger:boolean;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = props => {
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<OrgnrMap<Organisasjon> | undefined>(undefined);
    const [altinntilganger, setAltinntilganger] = useState<Record<AltinntjenesteId, Set<string>> | undefined>(undefined);
    const [altinnTilgangssøknader, setAltinnTilgangssøknader] = useState<AltinnTilgangssøknad[] | undefined>(undefined);

    const [reporteeMessagesUrls, setReporteeMessagesUrls] = useState<ReporteeMessagesUrls>({});
    const [tilgangTilSyfo, setTilgangTilSyfo] = useState(Tilgang.LASTER);

    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    const [visFeilmelding, setVisFeilmelding] = useState(false);


    useEffect(() => {
        hentOrganisasjoner()
            .then(orgs => {
                const gyldigeOrganisasjoner = orgs.filter(
                    org =>
                        org.OrganizationForm === 'BEDR' ||
                        org.OrganizationForm === 'AAFY' ||
                        org.Type === 'Enterprise'
                );
                setAltinnorganisasjoner(
                    Record.fromEntries(
                        gyldigeOrganisasjoner.map(org => [org.OrganizationNumber, org])
                    )
                );
                hentAltinnRaporteeIdentiteter().then(result => {
                    if (result instanceof Error) {
                        autentiserAltinnBruker(window.location.href);
                        setReporteeMessagesUrls({});
                    } else {
                        setReporteeMessagesUrls(result);
                    }
                });
            })
            .catch(() => {
                setAltinnorganisasjoner({});
                setVisFeilmelding(true);
            });

        hentAltinntilganger()
            .then(setAltinntilganger)
            .catch(() => setAltinntilganger(Record.map(altinntjeneste, () => new Set())));

        hentAltinnTilgangssøknader()
            .then(setAltinnTilgangssøknader)
            .catch(() => setAltinnTilgangssøknader([]));

        hentSyfoTilgang()
            .then(tilgangFromTruthy)
            .then(setTilgangTilSyfo)
            .catch(() => {
                setVisSyfoFeilmelding(true);
                setTilgangTilSyfo(Tilgang.IKKE_TILGANG);
            });
    }, []);

    if (altinnorganisasjoner && altinntilganger && altinnTilgangssøknader && tilgangTilSyfo !== Tilgang.LASTER) {
        const sjekkTilgang = (orgnr: orgnr) => (
            id: AltinntjenesteId,
            orgnrMedTilgang: Set<orgnr>
        ): Altinntilgang => {
            if (orgnrMedTilgang.has(orgnr)) {
                return { tilgang: 'ja' };
            }
            const { tjenestekode, tjenesteversjon } = altinntjeneste[id];
            const søknader = altinnTilgangssøknader.filter(
                s =>
                    s.orgnr === orgnr &&
                    s.serviceCode === tjenestekode &&
                    s.serviceEdition.toString() === tjenesteversjon
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

            return { tilgang: 'nei' };
        };

        const organisasjoner = Record.map(altinnorganisasjoner, (orgnr, org) => ({
            organisasjon: org,
            altinntilgang: Record.map(altinntilganger, sjekkTilgang(orgnr)),
        }));

        const detFinnesEnUnderenhetMedParent = () =>{
            return Record.values(organisasjoner).filter(org=> org.organisasjon.ParentOrganizationNumber!=null && org.organisasjon.ParentOrganizationNumber!="" ).length >0
        }
        const harTilganger= detFinnesEnUnderenhetMedParent() && Record.length(organisasjoner) > 0 || tilgangTilSyfo === Tilgang.TILGANG

        const context: Context = {
            organisasjoner,
            reporteeMessagesUrls,
            visFeilmelding,
            visSyfoFeilmelding,
            tilgangTilSyfo,
            harTilganger
        };

        return (
            <OrganisasjonerOgTilgangerContext.Provider value={context}>
                {props.children}
            </OrganisasjonerOgTilgangerContext.Provider>
        );
    }
    else {
        return (
            <Spinner />
        );
    }
};
