import { Organisasjon } from "../organisasjon";

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export async function hentSyfoTilgang(): Promise<boolean> {
  let respons = await fetch("/ditt-nav-arbeidsgover/api/narmesteleder");
  if (respons.ok) {
    respons.json();
  }
  var count = Object.keys(respons).length;
  if (count > 0) {
    return true;
  }
  return false;
}

function redirectHvisUnauthorized(respons: Response) {
  if (respons.status === 401) {
    window.location.href = "/ditt-nav-arbeidsgiver/login";
  }
}
