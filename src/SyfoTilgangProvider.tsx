import React, { Component } from "react";
import { hentSyfoTilgang } from "./api/dnaApi";
import {Sykemelding} from "./sykemelding";
import {hentSykemeldinger} from "./digisyfo-api";

export enum TilgangSyfo {
  LASTER,
  IKKE_TILGANG,
  TILGANG
}

export interface Context {
  tilgangTilSyfoState: TilgangSyfo;
  sykemeldingerState: Array<Sykemelding>;
}

interface State {
  tilgangTilSyfoState: TilgangSyfo;
  sykemeldingerState: Array<Sykemelding>;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export class SyfoTilgangProvider extends Component<{}, State> {
  state: State = {
    tilgangTilSyfoState: TilgangSyfo.LASTER,
    sykemeldingerState: Array<Sykemelding>()
  };

  async componentDidMount() {
    this.setState({ tilgangTilSyfoState: TilgangSyfo.LASTER });
    const tilgangSyfo = await hentSyfoTilgang();
    if (tilgangSyfo) {
      this.setState({ tilgangTilSyfoState: TilgangSyfo.TILGANG });
      const sykemeldinger=await hentSykemeldinger();
      this.setState({sykemeldingerState: sykemeldinger});
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
