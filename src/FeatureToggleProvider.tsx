import React, { createContext, useEffect, useState } from 'react';
// @ts-ignore

const featurePath = '/min-side-arbeidsgiver/api/feature';

export enum Feature {
    visRefusjon = 'msa.visRefusjon',

}

const featureTogglePath = (features: Feature[]): string => {
    const query = features.map(feature => `feature=${feature}`).join('&');
    return `${featurePath}?${query}`;
};

export const alleFeatures = Object.values(Feature);

export interface FeatureToggles {
    [toggles: string]: boolean;
}

export const FeatureToggleContext = createContext<FeatureToggles>({});

const hentFeatureToggles = async (featureToggles: Feature[]): Promise<FeatureToggles> => {
    const response = await fetch(featureTogglePath(alleFeatures), { credentials: 'same-origin' });
    return await response.json();
};

export const FeatureToggleProvider = (props: any) => {
    const [featureToggles, setFeatureToggles] = useState<FeatureToggles>({});

    const hentToggles = () => {
        hentFeatureToggles(alleFeatures).then(setFeatureToggles);
    };

    useEffect(() => {
        hentToggles();
    }, []);

    return (
        <FeatureToggleContext.Provider value={featureToggles}>
            {props.children}
        </FeatureToggleContext.Provider>
    );
};
