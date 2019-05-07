import { Organisasjon } from "../organisasjon";
import { SyfoKallObjekt } from "../syfoKallObjekt";
import { digiSyfoNarmesteLederLink, enhetsregisteretApiLink } from "../lenker";
import { defaultOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";

export interface Rolle {
  RoleType: string;
  RoleDefinitionId: number;
  RoleName: string;
  RoleDescription: string;
}

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export async function hentRollerOgSjekkTilgang(
  orgnr: string
): Promise<boolean> {
  let respons = await fetch("/ditt-nav-arbeidsgiver-api/api/roller/" + orgnr);
  if (respons.ok) {
    const objekt: Array<Rolle> = await respons.json();
    const rolle = objekt.find(rolle => 131 === rolle.RoleDefinitionId);
    if (rolle) {
      return true;
    }
    return false;
  }
  return false;
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
      return true;
    }
  }
  return false;
}

function redirectHvisUnauthorized(respons: Response) {
  if (respons.status === 401) {
    window.location.href = "/ditt-nav-arbeidsgiver/login";
  }
}
