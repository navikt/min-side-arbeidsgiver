import { Organisasjon } from "../organisasjon";
import { SyfoKallObjekt } from "../syfoKallObjekt";
import { digiSyfoNarmesteLederLink, enhetsregisteretApiLink } from "../lenker";
import { defaultOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";
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

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
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

export async function hentBedriftsInfo(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(enhetsregisteretApiLink(orgnr));
  if (respons.ok) {
    const enhet: EnhetsregisteretOrg = await respons.json();
    return enhet;
  }
  console.log("kunne ikke hente informasjon for orgnr: ", orgnr);
  return defaultOrg;
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
