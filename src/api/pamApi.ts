import { pamApiLink } from "../lenker";

export async function sjekkPamTilgang(orgnr: string): Promise<boolean> {
  let respons = await fetch(pamApiLink(orgnr));
  if (respons.ok) {
    return true;
  } else {
    return false;
  }
}
