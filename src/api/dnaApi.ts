import { Organisasjon } from "../organisasjon";
import { SyfoKallObjekt } from "../syfoKallObjekt";

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export async function hentSyfoTilgang(): Promise<boolean> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/narmesteleder");
  console.log("kaller pams ", respons);
  if (respons.ok) {
    const objekt: SyfoKallObjekt = await respons.json();
    console.log(objekt);
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
