import React, { FunctionComponent, useEffect, useState } from "react";
import { hentSyfoTilgang } from "./api/dnaApi";
import { hentNarmesteAnsate, hentSyfoOppgaver } from "./digisyfoApi";
import { SyfoOppgave } from "./syfoOppgaver";

export enum TilgangState {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

export interface Context {
  tilgangTilSyfoState: TilgangState;
  syfoOppgaverState: Array<SyfoOppgave>;
  syfoAnsatteState: number;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export const SyfoTilgangProvider: FunctionComponent = props => {
  const [tilgangTilSyfoState, setTilgangTilSyfoState] = useState(
    TilgangState.LASTER
  );
  const [syfoOppgaverState, setSyfoOppgaverState] = useState(
    Array<SyfoOppgave>()
  );
  const [syfoAnsatteState, setSyfoAnsatteState] = useState(0);

  useEffect(() => {
    const getSyfoTilganger = async () => {
      const tilgangSyfo = await hentSyfoTilgang();
      setTilgangTilSyfoState(TilgangState.LASTER);
      if (tilgangSyfo) {
        setTilgangTilSyfoState(TilgangState.TILGANG);
        setSyfoOppgaverState(await hentSyfoOppgaver());
        const syfoAnsatteArray = await hentNarmesteAnsate();
        console.log("syfoAnsatteArray", syfoAnsatteArray);
        setSyfoAnsatteState(syfoAnsatteArray.length);
      } else {
        setTilgangTilSyfoState(TilgangState.IKKE_TILGANG);
      }
    };
    getSyfoTilganger();
  }, []);

  let defaultContext: Context = {
    tilgangTilSyfoState,
    syfoOppgaverState,
    syfoAnsatteState
  };

  return (
    <SyfoTilgangContext.Provider value={defaultContext}>
      {props.children}
    </SyfoTilgangContext.Provider>
  );
};
