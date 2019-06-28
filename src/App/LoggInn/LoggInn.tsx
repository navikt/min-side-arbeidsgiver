import React, { FunctionComponent } from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import "./Logginn.less";
import { logInfo } from "../../utils/metricsUtils";
import koffert from "./group.svg";
import Lenke from "nav-frontend-lenker";
import LoggInnBanner from "./LoggInnBanner/LoggInnBanner";
import { Sidetittel } from "nav-frontend-typografi";
import { Innloggingstjenester } from "./Innloggingstjenester/Innloggingstjenester";
import { Informasjonsboks } from "./Informasjonboks/Informasjonsboks";

export const LoggInn: FunctionComponent = () => {
  const redirectTilLogin = () => {
    logInfo("klikk på login");
    window.location.href = "/ditt-nav-arbeidsgiver/redirect-til-login";
  };

  return (
    <div className="innloggingsside">
      <LoggInnBanner />
      <div className={"innloggingsside__innhold"}>
        <img
          src={koffert}
          alt={"Bilde av koffert for å illustrere arbeidsgivere"}
          className={"innloggingsside__ikon"}
        />
        <Sidetittel className={"innloggingsside__sidetittel"}>
          NAVS tjenester samlet på ett sted
        </Sidetittel>
        Nå er det enklere for deg som arbeidsgiver å samarbeide med NAV med en
        felles inngang til tjenester og oppgaver relatert til:
        <Innloggingstjenester />
        <Informasjonsboks />
        <Hovedknapp
          className={"innloggingsside__loginKnapp"}
          onClick={redirectTilLogin}
        >
          Logg inn
        </Hovedknapp>
        <div className="innloggingsside__besok-ditt-nav">
          Ønsker du å se dine tjenester som privatperson?{" "}
          <Lenke href={"https://www.nav.no/no/Person"}>
            Logg inn på Ditt NAV
          </Lenke>
        </div>
      </div>
    </div>
  );
};
