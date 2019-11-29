import React, { FunctionComponent, useEffect, useState } from 'react';
import { hentSyfoTilgang } from './api/dnaApi';
import { hentNarmesteAnsate, hentSyfoOppgaver } from './api/digisyfoApi';
import { SyfoOppgave } from './Objekter/syfoOppgaver';
import { Tilgang } from './App/LoginBoundary';
import {logError} from "./utils/metricsUtils";

export interface Context {
    tilgangTilSyfoState: Tilgang;
    syfoOppgaverState: Array<SyfoOppgave>;
    syfoAnsatteState: number;
    visSyfoFeilmelding:boolean;
    visSyfoOppgaveFeilmelding:boolean;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export const SyfoTilgangProvider: FunctionComponent = props => {
    const [tilgangTilSyfoState, setTilgangTilSyfoState] = useState(Tilgang.LASTER);
    const [syfoOppgaverState, setSyfoOppgaverState] = useState(Array<SyfoOppgave>());
    const [syfoAnsatteState, setSyfoAnsatteState] = useState(0);
    const [visSyfoFeilmelding,setVisSyfoFeilmelding] = useState(false);
    const [visSyfoOppgaveFeilmelding, setVisSyfoOppgaveFeilmelding] = useState(false);
    useEffect(() => {
        setTilgangTilSyfoState(Tilgang.LASTER);
        let tilgangSyfoRespons = false;
        const getSyfoTilganger = async () => {
            try{
             tilgangSyfoRespons = await hentSyfoTilgang();
            }catch(e){
                logError("Feil ved tilgangssjekk til Digisyfo");
                setVisSyfoFeilmelding(true);
                tilgangSyfoRespons=false;
            }
            if (tilgangSyfoRespons) {
                setTilgangTilSyfoState(Tilgang.TILGANG);
                try {
                    setSyfoOppgaverState(await hentSyfoOppgaver());
                }
                catch(e){
                    logError(e);
                    setVisSyfoOppgaveFeilmelding(true);
                }
                try {
                    const syfoAnsatteArray = await hentNarmesteAnsate();
                    setSyfoAnsatteState(syfoAnsatteArray.length);
                }catch(e){
                    logError(e);
                }
            } else {
                setTilgangTilSyfoState(Tilgang.IKKE_TILGANG);
            }
        };
        getSyfoTilganger();
    }, []);

    let defaultContext: Context = {
        tilgangTilSyfoState,
        syfoOppgaverState,
        syfoAnsatteState,
        visSyfoFeilmelding,
        visSyfoOppgaveFeilmelding
    };

    return (
        <SyfoTilgangContext.Provider value={defaultContext}>
            {props.children}
        </SyfoTilgangContext.Provider>
    );
};
