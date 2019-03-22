import { pamApiLink } from "../lenker";

export async function hentPamTilgang(orgnr: string): Promise<boolean> {
  let respons = await fetch(pamApiLink(orgnr));
  return !!respons.ok;
}
