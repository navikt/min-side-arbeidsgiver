import React, {FunctionComponent, useEffect, useState} from 'react';

import {
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAtinnskjema,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
import {Organisasjon} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import {Tilgang} from './App/LoginBoundary';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    listeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[];
    organisasjonerMedIAWEB: Organisasjon[];
    organisasjonslisteFerdigLastet: Tilgang;
    organisasjonerMedIAFerdigLastet: Tilgang;
    alltinnSkjemaMedTilgangerFerdigLastet: Tilgang
    visFeilmelding: boolean;
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
    {
        navn: 'Tiltaksgjennomforing',
        kode: '5332',
        versjon: '2',
        testversjon: '1'
    },
];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export interface AltinnSkjema {
    navn: string;
    kode: string;
    versjon: string;
    testversjon?: string;
}

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState(Array<Organisasjon>());
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState(
        [] as SkjemaMedOrganisasjonerMedTilgang[]
    );
    const [organisasjonslisteFerdigLastet, setOrganisasjonslisteFerdigLastet] = useState(
        Tilgang.LASTER
    );
    const [organisasjonerMedIAFerdigLastet, setOrganisasjonerMedIAFerdigLastet] = useState(
        Tilgang.LASTER
    );
    const [alltinnSkjemaMedTilgangerFerdigLastet, setAlltinnSkjemaMedTilgangerFerdigLastet] = useState(
        Tilgang.LASTER
    );
    const [visFeilmelding, setVisFeilmelding] = useState(false);

    useEffect(() => {
        setOrganisasjonslisteFerdigLastet(Tilgang.LASTER);
        setOrganisasjonerMedIAFerdigLastet(Tilgang.LASTER);
        setAlltinnSkjemaMedTilgangerFerdigLastet(Tilgang.LASTER);
        const getOrganisasjoner = async () => {
            let organisasjonerRespons: Organisasjon[] = [];
            try {
                organisasjonerRespons = await hentOrganisasjoner();
            } catch (e) {
                organisasjonerRespons = [];
                setVisFeilmelding(true);
            }
            if (organisasjonerRespons.length > 0) {
                setOrganisasjoner(organisasjonerRespons);
                setOrganisasjonslisteFerdigLastet(Tilgang.TILGANG);
            } else {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
                setOrganisasjonslisteFerdigLastet(Tilgang.IKKE_TILGANG);
            }
        };
        const getOrganisasjonerTilIAweb = async () => {
            let organisasjonerIAWEB = await hentOrganisasjonerIAweb();
            setOrganisasjonerMedIAWEB(
                organisasjonerIAWEB.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
            if (organisasjonerIAWEB.length === 0) {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.IKKE_TILGANG);
            } else {
                setOrganisasjonerMedIAFerdigLastet(Tilgang.TILGANG);
            }
        };
        const finnTilgangerTilSkjema = async (skjemaer: AltinnSkjema[]) => {
            const liste = await hentTilgangForAlleAtinnskjema(skjemaer);
            setAlltinnSkjemaMedTilgangerFerdigLastet(Tilgang.TILGANG);
            setListeMedSkjemaOgTilganger(liste);
        };

        getOrganisasjoner();
        finnTilgangerTilSkjema(ListeMedAltinnSkjemaKoder);
        getOrganisasjonerTilIAweb();
    }, []);

    let defaultContext: Context = {
        organisasjoner,
        listeMedSkjemaOgTilganger,
        organisasjonerMedIAWEB,
        organisasjonerMedIAFerdigLastet,
        organisasjonslisteFerdigLastet,
        alltinnSkjemaMedTilgangerFerdigLastet,
        visFeilmelding,
    };

    return (
        <>
            {organisasjonerMedIAFerdigLastet !== Tilgang.LASTER &&
                organisasjonslisteFerdigLastet !== Tilgang.LASTER && alltinnSkjemaMedTilgangerFerdigLastet !== Tilgang.LASTER && (
                    <OrganisasjonsListeContext.Provider value={defaultContext}>
                        {props.children}
                    </OrganisasjonsListeContext.Provider>
                )}
        </>
    );
};
