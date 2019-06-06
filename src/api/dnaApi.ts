import { Organisasjon, OverenhetOrganisasjon } from "../organisasjon";
import { SyfoKallObjekt } from "../syfoKallObjekt";
import {
  digiSyfoNarmesteLederLink,
  hentArbeidsavtalerApiLink
} from "../lenker";

import { logInfo } from "../utils/metricsUtils";

export interface Rolle {
  RoleType: string;
  RoleDefinitionId: number;
  RoleName: string;
  RoleDescription: string;
}

enum AltinnKode {
  HelseSosialOgVelferdstjenester = 131,
  AnsvarligRevisor = 5602,
  LonnOgPersonalmedarbeider = 3,
  RegnskapsførerLønn = 5607,
  RegnskapsførerMedSignering = 5608,
  RegnskapsførerUtenSignering = 5609,
  Revisormedarbeider = 5610,
  KontaktPersonNUF = 188
}

export interface Arbeidsavtale {
  status: string;
}

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export function lagToDimensjonalArray(
  organisasjoner: Array<Organisasjon>
): Array<OverenhetOrganisasjon> {
  let juridiskeEnheter = organisasjoner.filter(function(
    organisasjon: Organisasjon
  ) {
    return organisasjon.Type === "Enterprise";
  });
  logInfo("juridiske enheter: " + juridiskeEnheter);

  return juridiskeEnheter.map(juridiskEnhet => {
    const underenheter = organisasjoner.filter(
      underenhet =>
        underenhet.ParentOrganizationNumber === juridiskEnhet.OrganizationNumber
    );
    return {
      overordnetOrg: juridiskEnhet,
      UnderOrganisasjoner: underenheter
    };
  });
}

export async function hentRoller(orgnr: string): Promise<Array<Rolle>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/roller/" + orgnr);
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export function sjekkAltinnRolleHelseSosial(rolleListe: Array<Rolle>): boolean {
  const rolle = rolleListe.find(
    rolle =>
      AltinnKode.HelseSosialOgVelferdstjenester === rolle.RoleDefinitionId
  );
  if (rolle) {
    return true;
  }
  return false;
}

export function sjekkAltinnRolleForInntekstmelding(
  rolleListe: Array<Rolle>
): boolean {
  const koderSomGirTilgangTilInntekstmelding = [
    AltinnKode.AnsvarligRevisor,
    AltinnKode.LonnOgPersonalmedarbeider,
    AltinnKode.RegnskapsførerLønn,
    AltinnKode.RegnskapsførerMedSignering,
    AltinnKode.RegnskapsførerUtenSignering,
    AltinnKode.Revisormedarbeider,
    AltinnKode.KontaktPersonNUF
  ];

  const listeMedRollerSomGirTilgang = rolleListe
    .map(rolle => rolle.RoleDefinitionId)
    .filter(kode => koderSomGirTilgangTilInntekstmelding.includes(kode));
  return listeMedRollerSomGirTilgang.length > 0;
}

export async function hentSyfoTilgang(): Promise<boolean> {
  let respons = await fetch(digiSyfoNarmesteLederLink);
  if (respons.ok) {
    const objekt: SyfoKallObjekt = await respons.json();
    if (objekt.narmesteLedere.length) {
      logInfo("har syfotilgang");
      return true;
    }
  }
  return false;
}

export async function hentTiltaksgjennomforingTilgang(): Promise<
  Array<Arbeidsavtale>
> {
  let respons = await fetch(hentArbeidsavtalerApiLink());
  if (respons.ok) {
    const avtaler: Array<Arbeidsavtale> = await respons.json();
    return avtaler;
  }
  return [];
}
