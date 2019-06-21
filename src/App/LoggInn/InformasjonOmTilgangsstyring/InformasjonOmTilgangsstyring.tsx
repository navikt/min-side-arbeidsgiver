import React, { FunctionComponent } from "react";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import "./InformasjonOmTilgangsstyring.less";
import LoggInnBanner from "../LoggInnBanner/LoggInnBanner";
import Lenke from "nav-frontend-lenker";
import {
  LenkeTilInfoOmAltinnRoller,
  LenkeTilInfoOmNarmesteLeder
} from "../../../lenker";
import {
  Innholdstittel,
  Normaltekst,
  Element,
  Undertittel
} from "nav-frontend-typografi";

const InformasjonOmTilgangsstyring: FunctionComponent = () => {
  return (
    <div className={"informasjon-om-tilgangsstyring "}>
      <LoggInnBanner />
      <div className={"informasjon-om-tilgangsstyring__tekst"}>
        <Innholdstittel
          className={"informasjon-om-tilgangsstyring__innholdstittel"}
        >
          {" "}
          Tilganger i Altinn{" "}
        </Innholdstittel>
        <Normaltekst className={"informasjon-om-tilgangsstyring__ingress"}>
          Navs tjenester for arbeidsgivere krever at du er registrert med
          bestemte roller i Altinn. Her får du en oversikt over hvilke roller de
          forskjellige tjenestene krever.
        </Normaltekst>
        <Undertittel className={"informasjon-om-tilgangsstyring__systemtittel"}>
          Slik får du tilgang til tjenestene
        </Undertittel>
        <Ekspanderbartpanel tittel="Rekruttering" border>
          <Normaltekst>
            På{" "}
            <Lenke href={"https://arbeidsplassen.nav.no/"}>
              Arbeidsplassen
            </Lenke>{" "}
            kan du finne kandidater og opprette stillingsannonser.
          </Normaltekst>
          <Element>Du må ha en av disse rollene: </Element>
          <ul>
            <li>Lønn og personalmedarbeider</li>
            <li>Utfyller/innsender</li>
          </ul>
          <Element>Eller denne rettigheten: </Element>
          <ul>
            <li>Rekruttering</li>
          </ul>
        </Ekspanderbartpanel>
        <Ekspanderbartpanel tittel="Sykemeldte" border>
          Tilgang til digitale sykemeldinger krever at du er registrert som
          Nærmeste leder for én eller flere ansatte i din virksomhet. Les mer om
          registrering av Nærmeste leder{" "}
          <Lenke href={LenkeTilInfoOmNarmesteLeder}>her.</Lenke>
        </Ekspanderbartpanel>
        <Ekspanderbartpanel tittel="Klikk her for å åpne/lukke panelet" border>
          Panelet vil da ekspandere og vise innholdet.
        </Ekspanderbartpanel>
        Navs tjenester for arbeidsgivere krever at du er registrert med bestemte
        roller i Altinn. Her får du en oversikt over hvilke roller de
        forskjellige tjenestene krever.
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
        // En av rollene
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
