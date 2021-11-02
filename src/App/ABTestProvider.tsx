
import React, { createContext, useEffect, useState } from 'react';



export interface Eksperimenter {
    tallIBoks?: boolean;
}

export const EksperimentContext = createContext<Eksperimenter>({});

const henteksperimentVedier = async (): Promise<boolean> => {
    const response = await fetch('/min-side-arbeidsgiver/abtest', { credentials: 'same-origin' });
    return response.json();
};

export const ABTestProvider = (props: any) => {
    const [eksperimenter, setEksperimenter] = useState<Eksperimenter>({});

    const fåutfall = () => {
        henteksperimentVedier().then( eksperiment => {
            setEksperimenter({tallIBoks:eksperiment});
        });
    };

    useEffect(() => {
        fåutfall();
    }, []);

    return (
        <EksperimentContext.Provider value={eksperimenter}>
            {props.children}
        </EksperimentContext.Provider>
    );
};
