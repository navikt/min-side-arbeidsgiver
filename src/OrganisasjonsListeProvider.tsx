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
    organisasjonslisteFerdigLastet: Tilgang;
    organisasjonerMedIAFerdigLastet: Tilgang;
    visFeilmelding:boolean;
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
    const [organisasjonslisteFerdigLastet, setOrganisasjonslisteFerdigLastet] = useState(Tilgang.LASTER);
    const [organisasjonerMedIAFerdigLastet, setOrganisasjonerMedIAFerdigLastet] = useState(Tilgang.LASTER);
    const [visFeilmelding, setVisFeilmelding] = useState(false);

    useEffect(() => {
        const getOrganisasjoner = async () => {
            setOrganisasjonerMedIAFerdigLastet(Tilgang.LASTER);
            let organisasjonerRespons:Organisasjon[] =[];
            try {
                organisasjonerRespons = await hentOrganisasjoner();
            }
    catch(e){
            organisasjonerRespons = [];
            setVisFeilmelding(true);
        }
            if (organisasjonerRespons.length > 0) {
                setOrganisasjoner(
                    organisasjonerRespons.filter((organisasjon: Organisasjon) => {
                        return (
                            organisasjon.OrganizationForm === 'BEDR' &&
                            organisasjon.ParentOrganizationNumber
                        );
                    })
                );
                const toDim: Array<JuridiskEnhetMedUnderEnheterArray> = await byggOrganisasjonstre(
                    organisasjonerRespons
                );
                setOrganisasjonslisteFerdigLastet(Tilgang.TILGANG);
                setorganisasjonstre(toDim);
            } else {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
            }
        };
        const getOrganisasjonerTilIAweb = async () => {
            let organisasjonerIAWEB = await hentOrganisasjonerIAweb();
            setOrganisasjonerMedIAWEB(
                organisasjonerIAWEB.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
            if ((organisasjonerIAWEB.length === 0)) {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
            } else {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.TILGANG);
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
        organisasjonerMedIAFerdigLastet,
        organisasjonslisteFerdigLastet,
        visFeilmelding
    };

    return (
        <>{organisasjonerMedIAFerdigLastet !== Tilgang.LASTER && organisasjonslisteFerdigLastet &&
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>}
            </>
    );
};
