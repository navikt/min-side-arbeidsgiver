import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    byggOrganisasjonstre,
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAtinnskjema,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { Tilgang } from './App/LoginBoundary';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    organisasjonstre: Array<JuridiskEnhetMedUnderEnheterArray>;
    listeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[];
    organisasjonerMedIAWEB: Organisasjon[];
    orgListeFerdigLastet: Tilgang;
    orgMedIAFerdigLastet: Tilgang;
};

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
        navn: 'Lonnstilskudd',
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
];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export interface AltinnSkjema {
    navn: string;
    kode: string;
    versjon: string;
}

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonstre, setorganisasjonstre] = useState(
        Array<JuridiskEnhetMedUnderEnheterArray>()
    );
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState(Array<Organisasjon>());
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState(
        [] as SkjemaMedOrganisasjonerMedTilgang[]
    );
    const [orgListeFerdigLastet, setOrgListeFerdigLastet] = useState(Tilgang.LASTER);
    const [orgMedIAFerdigLastet, setOrgMedIAFerdigLastet] = useState(Tilgang.LASTER);

    useEffect(() => {
        const getOrganisasjoner = async () => {
            setOrgListeFerdigLastet(Tilgang.LASTER);
            let organisasjoner = await hentOrganisasjoner();
            if (organisasjoner.length > 0) {
                setOrganisasjoner(
                    organisasjoner.filter((organisasjon: Organisasjon) => {
                        return (
                            organisasjon.OrganizationForm === 'BEDR' &&
                            organisasjon.ParentOrganizationNumber
                        );
                    })
                );
                const toDim: Array<JuridiskEnhetMedUnderEnheterArray> = await byggOrganisasjonstre(
                    organisasjoner
                );
                setOrgListeFerdigLastet(Tilgang.TILGANG);
                setorganisasjonstre(toDim);
            } else {
                setOrgListeFerdigLastet(Tilgang.IKKE_TILGANG);
            }
        };
        const getOrganisasjonerTilIAweb = async () => {
            let organisasjonerIAWEB = await hentOrganisasjonerIAweb();
            setOrganisasjonerMedIAWEB(
                organisasjonerIAWEB.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
            if ((organisasjonerIAWEB.length = 0)) {
                setOrgMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
            } else {
                setOrgMedIAFerdigLastet(Tilgang.TILGANG);
            }
        };
        const finnTilgangerTilSkjema = async (skjemaer: AltinnSkjema[]) => {
            const liste = await hentTilgangForAlleAtinnskjema(skjemaer);
            setListeMedSkjemaOgTilganger(liste);
        };

        getOrganisasjoner();
        finnTilgangerTilSkjema(ListeMedAltinnSkjemaKoder);
        getOrganisasjonerTilIAweb();
    }, []);

    let defaultContext: Context = {
        organisasjoner,
        organisasjonstre,
        listeMedSkjemaOgTilganger,
        organisasjonerMedIAWEB,
        orgListeFerdigLastet,
        orgMedIAFerdigLastet,
    };

    return (
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    );
};
