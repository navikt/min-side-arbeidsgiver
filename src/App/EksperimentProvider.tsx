import React, { createContext, useEffect, useState } from 'react';
import amplitude from '../utils/amplitude';
import { SyfoTilgang } from './OrganisasjonerOgTilgangerProvider';

export interface Eksperimenter {
    visTall?: boolean;
}
export const EksperimentContext = createContext<Eksperimenter>({});

const henteksperimentVedier = async (): Promise<boolean> => {
    const response = await fetch('/min-side-arbeidsgiver/abtest', { credentials: 'same-origin' });
    return response.json();
};

export const EksperimentProvider = (props: any) => {
    const [eksperimenter, setEksperimenter] = useState<Eksperimenter>({});

    const hentUtfall = () => {
        henteksperimentVedier().then( utfall => {
            setEksperimenter({visTall:utfall});
            amplitude.setUserProperties({visTall:utfall});
        });
    };
    useEffect(() => {
        hentUtfall();
    }, []);

    return (
        <EksperimentContext.Provider value={eksperimenter}>
            {props.children}
        </EksperimentContext.Provider>
    );
};
