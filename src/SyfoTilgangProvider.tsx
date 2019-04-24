import React, { Component } from "react";
import { hentSyfoTilgang } from "./api/dnaApi";

export enum TilgangSyfo {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

export interface Context {
  tilgangTilSyfoState: TilgangSyfo;
}

interface State {
  tilgangTilSyfoState: TilgangSyfo;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export class SyfoTilgangProvider extends Component<{}, State> {
  state: State = {
    tilgangTilSyfoState: TilgangSyfo.LASTER
  };

  async componentDidMount() {
    this.setState({ tilgangTilSyfoState: TilgangSyfo.LASTER });
    const tilgangSyfo = await hentSyfoTilgang();
    if (tilgangSyfo) {
      this.setState({ tilgangTilSyfoState: TilgangSyfo.TILGANG });
    } else {
      this.setState({ tilgangTilSyfoState: TilgangSyfo.IKKE_TILGANG });
    }
  }

  render() {
    const context: Context = {
      ...this.state
    };

    return (
      <SyfoTilgangContext.Provider value={context}>
        {this.props.children}
      </SyfoTilgangContext.Provider>
    );
  }
}
