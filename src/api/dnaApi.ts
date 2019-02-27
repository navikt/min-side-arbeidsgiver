export async function hentHello(): Promise<string> {
  let respons = await fetch("/ditt-nav-arbeidsgiver-api/");
  let tekst = await respons.text();
  return tekst;
}
