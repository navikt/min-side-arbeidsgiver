import { pamApiLink } from "../lenker";

export async function sjekkPamTilgang(orgnr: string): Promise<boolean> {
  let respons = await fetch(pamApiLink(orgnr));
  console.log("sjekk pamtilgang", respons.status);
  if (respons.ok) {
    return true;
  } else {
    return false;
  }
}
