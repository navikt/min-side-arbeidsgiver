import React, { FunctionComponent } from "react";
import { Hovedknapp } from "nav-frontend-knapper";
import "./InformasjonOmTilgangsstyring.less";
import LoggInnBanner from "../LoggInnBanner/LoggInnBanner";
import Lenke from "nav-frontend-lenker";
import {
  LenkeTilInfoOmAltinnRoller,
  LenkeTilInfoOmNarmesteLeder
} from "../../../lenker";

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
        Tilgang til Dine sykemeldte krever at du er registrert som Nærmeste
        leder for én eller flere ansatte i din virksomhet. Les mer om
        registrering av Nærmeste leder{" "}
        <Lenke href={LenkeTilInfoOmNarmesteLeder}>Her.</Lenke>
        <br />
        <br />
        Dersom mangler tilgang til tjenester du mener du burde ha tilgang på,
        kan du lese mer om Altinnroller og hvem du må kontakte på
        <Lenke href={LenkeTilInfoOmAltinnRoller}>Her.</Lenke>
      </div>
    </div>
  );
};

export default InformasjonOmTilgangsstyring;
