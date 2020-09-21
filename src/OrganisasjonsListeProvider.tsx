import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAltinnskjema,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
import { Organisasjon } from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
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

export const OrganisasjonsListeContext = React.createContext<Context>({} as Context);

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState<Organisasjon[] | undefined>(undefined);
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState<Organisasjon[] | undefined>(undefined);
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState<
        SkjemaMedOrganisasjonerMedTilgang[] | undefined
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
            .then(organisasjoner => {
                const organisasjonerFiltrert = organisasjoner.filter(
                    org =>
                        org.OrganizationForm === 'BEDR' ||
                        org.OrganizationForm === 'AAFY' ||
                        org.Type === 'Enterprise'
                );
                setOrganisasjoner(organisasjonerFiltrert);
            })
            .catch(e => {
                setOrganisasjoner([]);
                setVisFeilmelding(true);
            });

        hentOrganisasjonerIAweb()
            .then(organisasjonerMedIA => {
                setOrganisasjonerMedIAWEB(
                    organisasjonerMedIA.filter(
                        organisasjon => organisasjon.OrganizationForm === 'BEDR'
                    )
                );
            })
            .catch(_ => setOrganisasjonerMedIAWEB([]));

        hentTilgangForAlleAltinnskjema(ListeMedAltinnSkjemaKoder)
            .then(skjemaer => setListeMedSkjemaOgTilganger(skjemaer))
            .catch(_ => setListeMedSkjemaOgTilganger([]));
    }, []);


    if (organisasjoner && listeMedSkjemaOgTilganger && organisasjonerMedIAWEB) {
        const context = {
            organisasjoner,
            listeMedSkjemaOgTilganger,
            organisasjonerMedIAWEB,
            reporteeMessagesUrls,
            visFeilmelding
        };
        return <OrganisasjonsListeContext.Provider value={context}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    } else {
        return <></>;
    }
};
