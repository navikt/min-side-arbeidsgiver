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
        en felles inngang til tjenester og oppgaver relatert til
        <ul>
          <li>Sykefraværtoppfølging</li>
          <li>Rekruttering</li>
          <li>Arbeidstrening</li>
          <li>Digitale skjemaer</li>
        </ul>
        <div>
          Tjenesten er tilgangsstyrt og baserer seg på tilganger utdelt av
          ansatte på din arbeidsplass. Hvis du ikke kan se tjenester du mener du
          burde ha tilgang til, kan du lese om tilgangsstyringen og hva du kan
          gjøre for å få tilgang på <Lenke href={basename}>her.</Lenke>
        </div>
        <Hovedknapp
          className={"innloggingsside__loginKnapp"}
          onClick={redirectTilLogin}
        >
          Logg inn
        </Hovedknapp>
        <div className="innloggingsside__besok-ditt-nav">
          Ønsker du å se dine tjenester som privat person?{" "}
          <Lenke href={"https://www.nav.no/no/Person"}>
            Logg inn på Ditt NAV
          </Lenke>
        </div>
      </div>
    </div>
  );
};

export default LoggInn;
