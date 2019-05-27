import React, {FunctionComponent, useEffect, useState} from "react";
import LoggInn from "./LoggInn/LoggInn";

import { veilarbStepup } from "../lenker";
import environment from "../utils/environment";
import hentVeilarbStatus from "../api/veilarbApi";

export enum Innlogget {
  LASTER,
  IKKE_INNLOGGET,
  INNLOGGET
}

function setEssoCookieLocally() {
  document.cookie = "nav-esso=0123456789..*; path=/; domain=localhost;";
}
async function getEssoToken() {
  let veilarbStatusRespons = await hentVeilarbStatus();
  if (!veilarbStatusRespons.erInnlogget) {
    window.location.href = veilarbStepup();
  }
}

const LoginBoundary: FunctionComponent = (props) => {

  const [innlogget, setInnlogget] = useState(Innlogget.IKKE_INNLOGGET);
  useEffect(() => {
    setInnlogget(Innlogget.LASTER);
    const getLoginStatus = async () => {
      let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
      if (respons.ok) {
        setInnlogget(Innlogget.INNLOGGET);
        if (environment.MILJO) {
          await getEssoToken();
        } else {
          setEssoCookieLocally();
        }
      } else if (respons.status === 401) {
        setInnlogget(Innlogget.IKKE_INNLOGGET);
      }
    };
    getLoginStatus();
    },[]);


    if (innlogget === Innlogget.INNLOGGET) {
      return <> {props.children} </>;
    }
    if (innlogget === Innlogget.IKKE_INNLOGGET) {
      return <LoggInn />;
    } else {
      return null;
    }

}

export default LoginBoundary;
