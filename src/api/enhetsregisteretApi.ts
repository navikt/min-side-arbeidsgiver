import { defaultOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";
import { enhetsregisteretApiLink } from "../lenker";

export async function hentBedriftsInfo(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(enhetsregisteretApiLink(orgnr));
  if (respons.ok) {
    const enhet: EnhetsregisteretOrg = await respons.json();
    return enhet;
  }
  console.log("kunne ikke hente informasjon for orgnr: ", orgnr);
  return defaultOrg;
}
