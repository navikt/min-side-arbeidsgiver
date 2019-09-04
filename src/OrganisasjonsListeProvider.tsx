import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    byggOrganisasjonstre,
    hentMenuToggle,
    hentOrganisasjoner,
    hentOrganisasjonerIAweb,
    hentTilgangForAlleAtinnskjema,
    SkjemaMedOrganisasjonerMedTilgang,
} from './api/dnaApi';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { TilgangAltinn } from './OrganisasjonDetaljerProvider';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    organisasjonstre: Array<JuridiskEnhetMedUnderEnheterArray>;
    visNyMeny: boolean;
    listeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[];
    organisasjonerMedIAWEB: Organisasjon[];
    setLasteStatusPaSkjema: (index: number) => void;
};

export const ListeMedAltinnSkjemaKoder: AltinnSkjema[] = [
    {
        navn: 'Ekspertbistand',
        kode: '5384',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'InkluderingsTilskudd',
        kode: '5212',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Lonnstilskudd',
        kode: '5159',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Mentortilskudd',
        kode: '5216',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Inntektsmelding',
        kode: '4936',
        tilstand: TilgangAltinn.LASTER,
    },
];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export interface AltinnSkjema {
    navn: string;
    kode: string;
    tilstand: TilgangAltinn;
}

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonstre, setorganisasjonstre] = useState(
        Array<JuridiskEnhetMedUnderEnheterArray>()
    );
    const [organisasjonerMedIAWEB, setOrganisasjonerMedIAWEB] = useState(Array<Organisasjon>());
    const [visNyMeny, setVisNyMeny] = useState(false);
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState(
        Array<SkjemaMedOrganisasjonerMedTilgang>()
    );

    const setLasteStatusPaSkjema = (index: number) => {
        let kopiListeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[] = listeMedSkjemaOgTilganger;
        kopiListeMedSkjemaOgTilganger[index].Skjema.tilstand = TilgangAltinn.TILGANG;
        setListeMedSkjemaOgTilganger(kopiListeMedSkjemaOgTilganger);
    };

    useEffect(() => {
        const getOrganisasjoner = async () => {
            let organisasjoner = await hentOrganisasjoner();
            console.log(organisasjoner);

            setOrganisasjoner(
                organisasjoner.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
            if (visNyMeny) {
                const toDim: Array<JuridiskEnhetMedUnderEnheterArray> = await byggOrganisasjonstre(
                    organisasjoner
                );
                setorganisasjonstre(toDim);
            }
        };
        const getOrganisasjonerTilIAweb = async () => {
            let organisasjoner = await hentOrganisasjonerIAweb();
            console.log(organisasjoner);

            setOrganisasjonerMedIAWEB(
                organisasjoner.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
        };
        const finnTilgangerTilSkjema = async (skjemaer: AltinnSkjema[]) => {
            const liste = await hentTilgangForAlleAtinnskjema(skjemaer);
            setListeMedSkjemaOgTilganger(liste);
        };

        const sjekkFodselsnr = async () => {
            const skalViseMeny: boolean = await hentMenuToggle(
                'dna.bedriftsvelger.brukNyBedriftsvelger'
            );
            setVisNyMeny(skalViseMeny);
        };
        sjekkFodselsnr();
        getOrganisasjoner();
        finnTilgangerTilSkjema(ListeMedAltinnSkjemaKoder);
        getOrganisasjonerTilIAweb();
    }, [visNyMeny]);

    let defaultContext: Context = {
        organisasjoner,
        organisasjonstre,
        visNyMeny,
        listeMedSkjemaOgTilganger,
        setLasteStatusPaSkjema,
        organisasjonerMedIAWEB,
    };

    return (
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    );
};
