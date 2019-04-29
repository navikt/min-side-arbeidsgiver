import React, { Component } from "react";
import LoggInn from "./LoggInn/LoggInn";
import {veilarbStepup} from "../lenker";
import environment from "../utils/environment";

export enum Innlogget {
  LASTER,
  IKKE_INNLOGGET,
  INNLOGGET
}

interface State {
  innlogget: Innlogget;
}
function setEssoCookieLocally(){
  console.log("set EssoLocally");
  document.cookie = "nav-esso=0123456789..*; path=/; domain=localhost;"
}

class LoginBoundary extends Component<{}, State> {
  state: State = {
    innlogget: Innlogget.IKKE_INNLOGGET
  };

  async componentDidMount() {
    console.log("mount");
    this.setState({ innlogget: Innlogget.LASTER });
    let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
    if (respons.ok) {
      this.setState({ innlogget: Innlogget.INNLOGGET });
      if (environment.MILJO){
        if(!document.cookie.split(';').filter((item) => item.trim().startsWith('nav-esso=')).length) {
          window.location.href = veilarbStepup();
        }}else{
        setEssoCookieLocally();
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
