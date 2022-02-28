import React, { useEffect } from 'react';

const localStoreKey = 'InntektsmeldingUndersøkelse'

/** Dette innsiktsarbeidet er over. Slett local store. */
export const UndersokelseInntektsmelding = () => {
    useEffect(() => {
        window.localStorage.removeItem(localStoreKey)
    }, []);
    return null;
};
