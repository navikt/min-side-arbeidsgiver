import React, { FunctionComponent, useEffect, useState } from 'react';

import {
    hentOrganisasjoner,
    byggOrganisasjonstre,
    hentMenuToggle,
    SkjemaMedOrganisasjonerMedTilgang,
    lagListeMedOrganisasjonerMedTilgangTilSkjema,
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

enum ServiceKoder {
    Ekspertbistand = 5384,
    InkluderingsTilskudd = 5212,
    Lønnstilskudd = 5159,
    Mentortilskudd = 5216,
    Inntektsmelding = 4936,
}

export const ListeMedServicekoder: string[] = ['5384', '5212', '5159', '5216', '4936'];

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

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
        const finnTilgangerTilSkjema = async (koder: string[]) => {
            const liste = await hentTilgangForAlleAtinnskjema(koder);
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
