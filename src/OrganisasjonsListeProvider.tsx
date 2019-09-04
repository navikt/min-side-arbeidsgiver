import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    byggOrganisasjonstre,
    hentMenuToggle,
    hentOrganisasjoner,
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
    setInnlastingsstatusForSkjema: (org: Organisasjon) => void;
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
        navn: 'Lønnstilskudd',
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
    const [visNyMeny, setVisNyMeny] = useState(false);
    const [listeMedSkjemaOgTilganger, setListeMedSkjemaOgTilganger] = useState(
        Array<SkjemaMedOrganisasjonerMedTilgang>()
    );

    const sjekkOmSkjemaErHentet = (
        skjema: SkjemaMedOrganisasjonerMedTilgang,
        listeMedAlleSkjema: SkjemaMedOrganisasjonerMedTilgang[]
    ): boolean => {
        const indexFunnetSkjema = listeMedAlleSkjema.indexOf(skjema);
        if (indexFunnetSkjema !== -1) {
            return true;
        }
        return false;
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
    }, [visNyMeny]);

    let defaultContext: Context = {
        organisasjoner,
        organisasjonstre,
        visNyMeny,
        listeMedSkjemaOgTilganger,
        setInnlastingsstatusForSkjema,
    };

    return (
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    );
};
