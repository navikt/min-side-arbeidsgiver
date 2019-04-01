import React, { Component } from "react";
import LoggInn from "./LoggInn/LoggInn";

interface State {
  innlogget: boolean;
}

class LoginBoundary extends Component<{}, State> {
  state: State = { innlogget: false };

  async componentDidMount() {
    let responsPam = await fetch(
      "ditt-nav-arbeidsgiver/pam/stillingsregistrering-api/api/stillinger/numberByStatus"
    );
    console.log("responspam: ", responsPam);

    let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
    if (respons.ok) {
      this.setState({ innlogget: true });
    } else if (respons.status === 401) {
      this.setState({ innlogget: false });
    }
  }
  render() {
    return <>{this.state.innlogget ? this.props.children : <LoggInn />}</>;
  }
}

export default LoginBoundary;
