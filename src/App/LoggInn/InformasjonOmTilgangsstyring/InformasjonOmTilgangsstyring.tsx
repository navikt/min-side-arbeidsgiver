import React, { FunctionComponent } from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import "./InformasjonOmTilgangsstyring.less";
import LoggInnBanner from "../LoggInnBanner/LoggInnBanner";
import Lenke from "nav-frontend-lenker";

const InformasjonOmTilgangsstyring: FunctionComponent = () => {
  return (
    <div className={"informasjon-om-tilgangsstyring"}>
      <LoggInnBanner />
      <div className={"informasjon-om-tilgangsstyring__tekst"}>
        Navs tjenester for arbeidsgivere krever at du er registrert med bestemte
        roller i Altinn. Her får du en oversikt over hvilke roller de
        forskjellige tjeneste krever.
        <br />
        <br />
        Rollen
        <ul>
          <li>Helse-, sosial og velferdstjenester</li>
          <br />
          Gir tilgang til tjenesten
          <br />
          <ul>
            <li>Arbeidstreningsavtale</li>
          </ul>
          <br />
          Og følgende skjema på Altinn:
          <br />
          <ul>
            <li>Inkluderingstilskudd</li>
            <li>Lønnstilskudd</li>
            <li>Tilskudd til mentor</li>
          </ul>
        </ul>
        <br />
        En av rollene
        <ul>
          <li>Ansvarlig revisor</li>
          <li>Lønn og personalmedarbeider</li>
          <li>Regnskapsfører lønn</li>
          <li>Regnskapsfører med signeringsrettighet</li>
          <li>Regnskapsfører uten signeringsrettighet</li>
          <li>Revisormedarbeider</li>
          <li>Kontaktperson NUF</li>
          <br />
          Gir tilgang til tjenestene
          <ul>
            <li>Inntektsmelding</li>
            <li>
              Rekruttering på{" "}
              <Lenke href={"https://arbeidsplassen.nav.no/"}>
                Arbeidsplassen
              </Lenke>
            </li>
            <li>Tilskudd til mentor</li>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default InformasjonOmTilgangsstyring;
