import React, { FunctionComponent, useEffect, useState } from 'react';
import { hentSyfoTilgang } from './api/dnaApi';
import { hentNarmesteAnsate, hentSyfoOppgaver } from './api/digisyfoApi';
import { SyfoOppgave } from './Objekter/syfoOppgaver';

export enum TilgangSyfo {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

export interface Context {
    tilgangTilSyfoState: TilgangSyfo;
    syfoOppgaverState: Array<SyfoOppgave>;
    syfoAnsatteState: number;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export const SyfoTilgangProvider: FunctionComponent = props => {
    const [tilgangTilSyfoState, setTilgangTilSyfoState] = useState(TilgangSyfo.LASTER);
    const [syfoOppgaverState, setSyfoOppgaverState] = useState(Array<SyfoOppgave>());
    const [syfoAnsatteState, setSyfoAnsatteState] = useState(0);

    useEffect(() => {
        const getSyfoTilganger = async () => {
            const tilgangSyfo = await hentSyfoTilgang();
            if (tilgangSyfo) {
                setTilgangTilSyfoState(TilgangSyfo.TILGANG);
                setSyfoOppgaverState(await hentSyfoOppgaver());
                const syfoAnsatteArray = await hentNarmesteAnsate();
                setSyfoAnsatteState(syfoAnsatteArray.length);
            } else {
                setTilgangTilSyfoState(TilgangSyfo.IKKE_TILGANG);
            }
        };
        getSyfoTilganger();
    }, []);

    let defaultContext: Context = {
        tilgangTilSyfoState,
        syfoOppgaverState,
        syfoAnsatteState,
    };

    return (
        <SyfoTilgangContext.Provider value={defaultContext}>
            {props.children}
        </SyfoTilgangContext.Provider>
    );
};
