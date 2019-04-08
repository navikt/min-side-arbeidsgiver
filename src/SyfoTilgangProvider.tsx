import React, { Component } from "react";
import { hentSyfoTilgang } from "./api/dnaApi";

export interface Context {
  tilgangTilSyfo: boolean;
}

interface State {
  tilgangTilSyfo: boolean;
}

const SyfoTilgangContext = React.createContext<Context>({} as Context);
export { SyfoTilgangContext };

export class SyfoTilgangProvider extends Component<{}, State> {
  state: State = {
    tilgangTilSyfo: false
  };

  async componentDidMount() {
    console.log("compdidmount i syfotilgangprovider");
    let tilgangSyfo = await hentSyfoTilgang();
    this.setState({ tilgangTilSyfo: tilgangSyfo });
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
