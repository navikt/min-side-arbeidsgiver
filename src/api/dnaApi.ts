import { Organisasjon } from "../organisasjon";

export async function hentHello(): Promise<string> {
  let respons = await fetch("/ditt-nav-arbeidsgiver-api/");
  let tekst = await respons.text();
  return tekst;
}

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  console.log(respons);
  let organisasjonsArray = await respons.json();
  console.log(organisasjonsArray);
  return organisasjonsArray;
}
