import { Organisasjon } from "../organisasjon";

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  redirectHvisUnauthorized(respons);
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

function redirectHvisUnauthorized(respons: Response) {
  if (respons.status === 401) {
    window.location.href =
      "http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/ditt-nav-arbeidsgiver";
  }
}
