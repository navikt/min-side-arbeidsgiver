import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    hentOrganisasjoner,
    byggOrganisasjonstre,
    hentMenuToggle,
    SkjemaMedOrganisasjonerMedTilgang,
    hentTilgangForAlleAtinnskjema,
} from './api/dnaApi';
import {
    JuridiskEnhetMedUnderEnheterArray,
    Organisasjon,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    organisasjonstre: Array<JuridiskEnhetMedUnderEnheterArray>;
    visNyMeny: boolean;
    listeMedSkjemaOgTilganger: SkjemaMedOrganisasjonerMedTilgang[];
};

export const ListeMedAltinnSkjemaKoder: AltinnSkjema[] = [
    {
        navn: 'Ekspertbistand',
        kode: '5384',
    },
    {
        navn: 'InkluderingsTilskudd',
        kode: '5212',
    },
    {
        navn: 'Lønnstilskudd',
        kode: '5159',
    },
    {
        navn: 'Mentortilskudd',
        kode: '5216',
    },
    {
        navn: 'Inntektsmelding',
        kode: '4936',
    },
];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export interface AltinnSkjema {
    navn: string;
    kode: string;
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
    };

    return (
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    );
};
