import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheterArray,
} from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { hentOrganisasjoner, byggOrganisasjonstre } from './api/dnaApi';

export type Context = {
    organisasjoner: Array<Organisasjon>;
    organisasjonstre: Array<JuridiskEnhetMedUnderEnheterArray>;
};

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export const OrganisasjonsListeProvider: FunctionComponent = props => {
    const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());
    const [organisasjonstre, setorganisasjonstre] = useState(
        Array<JuridiskEnhetMedUnderEnheterArray>()
    );

    useEffect(() => {
        const getOrganisasjoner = async () => {
            let organisasjoner = await hentOrganisasjoner();

            setOrganisasjoner(
                organisasjoner.filter((organisasjon: Organisasjon) => {
                    return organisasjon.OrganizationForm === 'BEDR';
                })
            );
            const toDim: Array<JuridiskEnhetMedUnderEnheterArray> = await byggOrganisasjonstre(
                organisasjoner
            );
            setorganisasjonstre(toDim);
        };
        getOrganisasjoner();
    }, []);

    let defaultContext: Context = {
        organisasjoner,
        organisasjonstre,
    };

    return (
        <OrganisasjonsListeContext.Provider value={defaultContext}>
            {props.children}
        </OrganisasjonsListeContext.Provider>
    );
};
