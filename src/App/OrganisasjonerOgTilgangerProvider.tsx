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
import { hentAltinntilganger } from '../altinn/tilganger';
import { alleAltinntjenster, AltinnId } from '../altinn/tjenester';

type orgnr = string;
type OrgnrMap<T> = { [orgnr: string]: T };

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinnSkjematilgang: Record<AltinnId, boolean>;
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
            .catch(_ => {
                setAltinnorganisasjoner({});
                setVisFeilmelding(true);
            });

        hentAltinntilganger()
            .then(setAltinntilganger)
            .catch(_ => setAltinntilganger(Record.map(alleAltinntjenster, _ => new Set())))

        hentSyfoTilgang()
            .then(tilgangFromTruthy)
            .then(setTilgangTilSyfo)
            .catch(_ => {
                setVisSyfoFeilmelding(true);
                setTilgangTilSyfo(Tilgang.IKKE_TILGANG);
            }) ;
    }, []);

    if (altinnorganisasjoner && altinntilganger) {
        const organisasjoner = Record.map(altinnorganisasjoner, org => ({
                organisasjon: org,
                altinnSkjematilgang: Record.map(altinntilganger, _ => _.has(org.OrganizationNumber))
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
