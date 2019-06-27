import React, { FunctionComponent } from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import "./Logginn.less";
import { logInfo } from "../../utils/metricsUtils";
import koffert from "./group.svg";
import medisin from "./Innloggingstjenester/medicine-capsule-1.svg";
import sok from "./Innloggingstjenester/search.svg";
import verktoy from "./Innloggingstjenester/toolbox.svg";

import Lenke from "nav-frontend-lenker";
import { basename } from "../../paths";
import LoggInnBanner from "./LoggInnBanner/LoggInnBanner";
import { Sidetittel, Element } from "nav-frontend-typografi";
import { Innloggingstjenester } from "./Innloggingstjenester/Innloggingstjenester";

export const LoggInn: FunctionComponent = () => {
  const redirectTilLogin = () => {
    logInfo("klikk på login");
    window.location.href = "/ditt-nav-arbeidsgiver/redirect-til-login";
  };

  return (
    <div className={"innloggingsside"}>
      <LoggInnBanner />
      <img src={koffert} />
      <Sidetittel>NAVS tjenester samlet på ett sted</Sidetittel>
      Nå er det enklere for deg som arbeidsgiver å samarbeide med NAV med en
      felles inngang til tjenester og oppgaver relatert til:
      <div>
        Tjenesten er tilgangsstyrt og baserer seg på roller registrert av din
        virksomhet i Altinn. Hvis du ikke kan se tjenester du mener du burde ha
        tilgang til, kan du lese om tilgangsstyringen og hva du kan gjøre for å
        få tilgang{" "}
        <Lenke href={basename + "/informasjon-om-tilgangsstyring"}>her.</Lenke>
      </div>
      <Innloggingstjenester />
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
  );
};
