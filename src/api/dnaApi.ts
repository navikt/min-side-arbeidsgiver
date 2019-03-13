import { Organisasjon } from "../organisasjon";

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

function redirectHvisUnauthorized(respons: Response) {
  if (respons.status === 401) {
    window.location.href = "/ditt-nav-arbeidsgiver/login";
  }
}
