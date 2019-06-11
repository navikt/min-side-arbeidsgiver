import React, { FunctionComponent } from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import "./Logginn.less";
import { logInfo } from "../../utils/metricsUtils";
import LoggInnBanner from "./LoggInnBanner/LoggInnBanner";
import Lenke from "nav-frontend-lenker";
import { basename } from "../../paths";

const LoggInn: FunctionComponent = () => {
  const redirectTilLogin = () => {
    logInfo("klikk på login");
    window.location.href = "/ditt-nav-arbeidsgiver/redirect-til-login";
  };

  return (
    <div className={"innloggingsside"}>
      <LoggInnBanner />
      <div className={"innloggingsside__tekst"}>
        Nå er det enklere for deg som arbeidsgiver å samarbeide med NAV ette er
        en felles inngang til tjenester og oppgaver relatert
        <ul>
          <li>Sykefraværtoppfølging</li>
          <li>Rekruttering</li>
          <li>Arbeidstrening</li>
          <li>Digitale skjemaer</li>
        </ul>
        Tjeneste er tilgangsstyrt og baserer seg på tilganger utdelt av ansatte
        på din arbeidsplass. Hvis du kan se tjenester du mener du burde ha
        tilgang på, kan du lese mer om tilgangsstyringen og hva du kan gjøre for
        å få tilgang
        <Lenke href={basename + "/"}>her.</Lenke>
        <Hovedknapp
          className={"innloggingsside__loginKnapp"}
          onClick={redirectTilLogin}
        >
          Logg inn
        </Hovedknapp>
      </div>
    </div>
  );
};

export default LoggInn;
