import React, { Component } from "react";
import LoggInn from "./LoggInn/LoggInn";
import {veilarbStepup} from "../lenker";

export enum Innlogget {
  LASTER,
  IKKE_INNLOGGET,
  INNLOGGET
}

interface State {
  innlogget: Innlogget;
}

class LoginBoundary extends Component<{}, State> {
  state: State = {
    innlogget: Innlogget.IKKE_INNLOGGET
  };

  async componentDidMount() {
    this.setState({ innlogget: Innlogget.LASTER });
    let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
    if (respons.ok) {
      this.setState({ innlogget: Innlogget.INNLOGGET });
      if(!document.cookie.split(';').filter((item) => item.trim().startsWith('nav-esso=')).length) {
        window.location.href = veilarbStepup();
      }
    } else if (respons.status === 401) {
      this.setState({ innlogget: Innlogget.IKKE_INNLOGGET });
    }
  }

  render() {
    if (this.state.innlogget === Innlogget.INNLOGGET) {
      return <> {this.props.children} </>;
    }
    if (this.state.innlogget === Innlogget.IKKE_INNLOGGET) {
      return <LoggInn />;
    } else {
      return null;
    }
  }
}

export default LoginBoundary;
