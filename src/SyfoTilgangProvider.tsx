import React, { FunctionComponent, useEffect, useState} from "react";
import { hentSyfoTilgang } from "./api/dnaApi";
import { hentSyfoOppgaver } from "./digisyfoApi";
import { SyfoOppgave } from "./syfoOppgaver";

export enum TilgangSyfo {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

export interface Context {
  tilgangTilSyfoState: TilgangSyfo;
  syfoOppgaverState: Array<SyfoOppgave>;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export const SyfoTilgangProvider : FunctionComponent = (props) => {

  const [tilgangTilSyfoState,setTilgangTilSyfoState] = useState(TilgangSyfo.LASTER);
  const [syfoOppgaverState,setSyfoOppgaverState] = useState(Array<SyfoOppgave>());

useEffect(()=>{
  const getSyfoTilganger = async ()=> {
    const tilgangSyfo = await hentSyfoTilgang();
    if (tilgangSyfo) {
      setTilgangTilSyfoState(TilgangSyfo.TILGANG);
      setSyfoOppgaverState(await hentSyfoOppgaver());
    } else {
      setTilgangTilSyfoState(TilgangSyfo.IKKE_TILGANG);
    }
  }
  getSyfoTilganger();
},[]);

  let defaultContext: Context = {
    tilgangTilSyfoState,
    syfoOppgaverState
  };

    return (
      <SyfoTilgangContext.Provider value={defaultContext}>
        {props.children}
      </SyfoTilgangContext.Provider>
    );
  };


