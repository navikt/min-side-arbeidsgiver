import { defaultOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";
import { enhetsregisteretApiLink } from "../lenker";

export async function hentBedriftsInfo(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(enhetsregisteretApiLink(orgnr));
  if (respons.ok) {
    console.log("henter bedriftsinformasjon");
    const enhet: EnhetsregisteretOrg = await respons.json();
    console.log(enhet);
    return enhet;
  }
  console.log("kunne ikke hente informasjon for orgnr: ", orgnr);
  return defaultOrg;
}
