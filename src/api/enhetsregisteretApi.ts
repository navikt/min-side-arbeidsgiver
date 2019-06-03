import { tomEnhetsregOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";
import { enhetsregisteretApiLink } from "../lenker";

export async function hentBedriftsInfo(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(enhetsregisteretApiLink(orgnr));
  if (respons.ok) {
    const enhet: EnhetsregisteretOrg = await respons.json();
    return enhet;
  }
  return tomEnhetsregOrg;
}
