import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAltinnskjema,
} from '../api/dnaApi';
import { Organisasjon } from '../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import {
    autentiserAltinnBruker,
    hentAltinnRaporteeIdentiteter,
    ReporteeMessagesUrls,
} from '../api/altinnApi';
import { gittMiljo } from '../utils/environment';
import * as Record from '../utils/Record';

type orgnr = string;
type OrgnrMap<T> = { [orgnr: string]: T };

export interface AltinnSkjema {
    navn: string;
    kode: string;
    versjon: string;
}

export type AltinnTjenesteMap<A> = Record<AltinnSkjemanavn, A>;

interface AltinnKode {
    kode: string;
    versjon: string;
}

export type AltinnSkjemanavn =
    | 'Ekspertbistand'
    | 'Inkluderingstilskudd'
    | 'Lønnstilskudd'
    | 'Mentortilskudd'
    | 'Inntektsmelding'
    | 'Arbeidstrening'
    | 'Arbeidsforhold'
    | 'Midlertidig lønnstilskudd'
    | 'Varig lønnstilskudd';

export const altinnSkjemakoder: Record<AltinnSkjemanavn, AltinnKode> = {
    Ekspertbistand: { kode: '5384', versjon: '1' },
    Inkluderingstilskudd: { kode: '5212', versjon: '1' },
    Lønnstilskudd: { kode: '5159', versjon: '1' },
    Mentortilskudd: { kode: '5216', versjon: '1' },
    Inntektsmelding: { kode: '4936', versjon: '1' },
    Arbeidstrening: { kode: '5332', versjon: gittMiljo({ prod: '2', other: '1' }) },
    Arbeidsforhold: { kode: '5441', versjon: '1' },
    'Midlertidig lønnstilskudd': { kode: '5516', versjon: '1' },
    'Varig lønnstilskudd': { kode: '5516', versjon: '2' },
};

export const altinnSkjemanavn: AltinnSkjemanavn[] = Record.keys(altinnSkjemakoder);

type AltinnSkjematilganger = Record<AltinnSkjemanavn, boolean>;

export const ingenSkjematilgang: AltinnSkjematilganger = Record.fromEntries(
    altinnSkjemanavn.map(navn => [navn, false])
);

export const ingenSkjemaOrganisasjoner: Record<AltinnSkjemanavn, Set<orgnr>> = Record.fromEntries(
    altinnSkjemanavn.map(navn => [navn, new Set()])
);

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinnSkjematilgang: AltinnTjenesteMap<boolean>;
    iawebtilgang: boolean;
};

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
};

const listeMedAltinnSkjemakoder = Object.entries(altinnSkjemakoder).map(([navn, kode]) => ({
    navn,
    ...kode,
}));

export const OrganisasjonsListeContext = React.createContext<Context>({} as Context);

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState<OrgnrMap<Organisasjon> | undefined>(
        undefined
    );
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState<Set<orgnr> | undefined>(
        undefined
    );
    const [skjematilganger, setSkjematilganger] = useState<
        Record<AltinnSkjemanavn, Set<string>> | undefined
    >(undefined);
    const [visFeilmelding, setVisFeilmelding] = useState(false);
    const [reporteeMessagesUrls, setReporteeMessagesUrls] = useState<ReporteeMessagesUrls>({});

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
            .then(setOrganisasjoner)
            .catch(_ => {
                setOrganisasjoner({});
                setVisFeilmelding(true);
            });

        hentOrganisasjonerIAweb()
            .then(orgs => orgs.filter(org => org.OrganizationForm === 'BEDR'))
            .then(orgs => orgs.map(org => org.OrganizationNumber))
            .then(orgs => new Set(orgs))
            .then(setOrganisasjonerMedIAWEB)
            .catch(_ => setOrganisasjonerMedIAWEB(new Set()));

        hentTilgangForAlleAltinnskjema(listeMedAltinnSkjemakoder)
            .then((resultat: any) => setSkjematilganger(resultat))
            .catch(_ => setSkjematilganger(ingenSkjemaOrganisasjoner));
    }, []);

    if (organisasjoner && skjematilganger && organisasjonerMedIAWEB) {
        const context: Context = {
            organisasjoner: Record.map(organisasjoner, org => {
                const orgnr = org.OrganizationNumber;
                const altinnSkjematilgang: AltinnSkjematilganger = Record.map(skjematilganger, _ =>
                    _.has(orgnr)
                );
                const z: OrganisasjonInfo = {
                    organisasjon: org,
                    iawebtilgang: organisasjonerMedIAWEB.has(orgnr),
                    altinnSkjematilgang,
                };
                return z;
            }),
            reporteeMessagesUrls,
            visFeilmelding,
        };

        return (
            <OrganisasjonsListeContext.Provider value={context}>
                {props.children}
            </OrganisasjonsListeContext.Provider>
        );
    } else {
        return <></>;
    }
};
