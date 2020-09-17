import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAltinnskjema,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
import { Organisasjon } from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { Tilgang } from './App/LoginBoundary';
import {
    autentiserAltinnBruker,
    hentAltinnRaporteeIdentiteter,
    ReporteeMessagesUrls,
} from './api/altinnApi';
import { gittMiljo } from './utils/environment';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    listeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[];
    organisasjonerMedIAWEB: Organisasjon[];
    organisasjonslisteFerdigLastet: Tilgang;
    organisasjonerMedIAFerdigLastet: Tilgang;
    alltinnSkjemaMedTilgangerFerdigLastet: Tilgang;
    reporteeMessagesUrls: ReporteeMessagesUrls;
    visFeilmelding: boolean;
};

export interface AltinnSkjema {
    navn: string;
    kode: string;
    versjon: string;
}

export const ListeMedAltinnSkjemaKoder: AltinnSkjema[] = [
    {
        navn: 'Ekspertbistand',
        kode: '5384',
        versjon: '1',
    },
    {
        navn: 'Inkluderingstilskudd',
        kode: '5212',
        versjon: '1',
    },
    {
        navn: 'Lønnstilskudd',
        kode: '5159',
        versjon: '1',
    },
    {
        navn: 'Mentortilskudd',
        kode: '5216',
        versjon: '1',
    },
    {
        navn: 'Inntektsmelding',
        kode: '4936',
        versjon: '1',
    },
    {
        navn: 'Arbeidstrening',
        kode: '5332',
        versjon: gittMiljo({prod: '2', other: '1'})
    },
    {
        navn: 'Arbeidsforhold',
        kode: '5441',
        versjon: '1',
    },
    {
        navn: 'Midlertidig lønnstilskudd',
        kode: '5516',
        versjon: '1',
    },
    {
        navn: 'Varig lønnstilskudd',
        kode: '5516',
        versjon: '2',
    },
];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState<Organisasjon[]>([]);
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState<Organisasjon[]>([]);
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState<
        SkjemaMedOrganisasjonerMedTilgang[]
    >([]);
    const [organisasjonslisteFerdigLastet, setOrganisasjonslisteFerdigLastet] = useState(
        Tilgang.LASTER
    );
    const [organisasjonerMedIAFerdigLastet, setOrganisasjonerMedIAFerdigLastet] = useState(
        Tilgang.LASTER
    );
    const [
        alltinnSkjemaMedTilgangerFerdigLastet,
        setAlltinnSkjemaMedTilgangerFerdigLastet,
    ] = useState(Tilgang.LASTER);
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
            .then(organisasjoner => {
                const organisasjonerFiltrert = organisasjoner.filter(
                    org =>
                        org.OrganizationForm === 'BEDR' ||
                        org.OrganizationForm === 'AAFY' ||
                        org.Type === 'Enterprise'
                );
                setOrganisasjoner(organisasjonerFiltrert);
                if (organisasjonerFiltrert.length > 0)
                    setOrganisasjonslisteFerdigLastet(Tilgang.TILGANG);
                else {
                    setOrganisasjonslisteFerdigLastet(Tilgang.IKKE_TILGANG);
                }
            })
            .catch(_ => {
                setOrganisasjoner([]);
                setVisFeilmelding(true);
                setOrganisasjonslisteFerdigLastet(Tilgang.IKKE_TILGANG);
            });

        hentOrganisasjonerIAweb()
            .then(organisasjonerMedIA => {
                setOrganisasjonerMedIAWEB(
                    organisasjonerMedIA.filter(
                        organisasjon => organisasjon.OrganizationForm === 'BEDR'
                    )
                );
                if (organisasjonerMedIA.length === 0) {
                    setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
                } else {
                    setOrganisasjonerMedIAFerdigLastet(Tilgang.TILGANG);
                }
            })
            .catch(_ => setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG));

        hentTilgangForAlleAltinnskjema(ListeMedAltinnSkjemaKoder)
            .then(skjemaer => {
                if (skjemaer.length > 0) {
                    setAlltinnSkjemaMedTilgangerFerdigLastet(Tilgang.TILGANG);
                    setListeMedSkjemaOgTilganger(skjemaer);
                } else {
                    setAlltinnSkjemaMedTilgangerFerdigLastet(Tilgang.IKKE_TILGANG);
                    setListeMedSkjemaOgTilganger([]);
                }
            })
            .catch(_ => setAlltinnSkjemaMedTilgangerFerdigLastet(Tilgang.IKKE_TILGANG));
    }, []);

    let defaultContext: Context = {
        organisasjoner,
        listeMedSkjemaOgTilganger,
        organisasjonerMedIAWEB,
        organisasjonerMedIAFerdigLastet,
        organisasjonslisteFerdigLastet,
        alltinnSkjemaMedTilgangerFerdigLastet,
        reporteeMessagesUrls,
        visFeilmelding,
    };

    return (
        <>
            {organisasjonerMedIAFerdigLastet !== Tilgang.LASTER &&
                organisasjonslisteFerdigLastet !== Tilgang.LASTER &&
                alltinnSkjemaMedTilgangerFerdigLastet !== Tilgang.LASTER && (
                    <OrganisasjonsListeContext.Provider value={defaultContext}>
                        {props.children}
                    </OrganisasjonsListeContext.Provider>
                )}
        </>
    );
};
