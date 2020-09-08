import React, { FunctionComponent, useEffect, useState } from 'react';
import { hentSyfoTilgang } from './api/dnaApi';
import { Tilgang } from './App/LoginBoundary';

export interface Context {
    tilgangTilSyfoState: Tilgang;
    visSyfoFeilmelding: boolean;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export const SyfoTilgangProvider: FunctionComponent = props => {
    const [tilgangTilSyfoState, setTilgangTilSyfoState] = useState(Tilgang.LASTER);
    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    useEffect(() => {
        setTilgangTilSyfoState(Tilgang.LASTER);
        let tilgangSyfoRespons = false;
        const getSyfoTilganger = async () => {
            try {
                tilgangSyfoRespons = await hentSyfoTilgang();
            } catch (e) {
                setVisSyfoFeilmelding(true);
                tilgangSyfoRespons = false;
                setTilgangTilSyfoState(Tilgang.IKKE_TILGANG);
            }
            if (tilgangSyfoRespons) {
                setTilgangTilSyfoState(Tilgang.TILGANG);
            } else {
                setTilgangTilSyfoState(Tilgang.IKKE_TILGANG);
            }
        };
        getSyfoTilganger();
    }, []);

    let defaultContext: Context = {
        tilgangTilSyfoState,
        visSyfoFeilmelding,
    };

    return (
        <SyfoTilgangContext.Provider value={defaultContext}>
            {props.children}
        </SyfoTilgangContext.Provider>
    );
};
