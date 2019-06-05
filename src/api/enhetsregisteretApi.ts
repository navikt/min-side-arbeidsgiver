import { tomEnhetsregOrg, EnhetsregisteretOrg } from "../enhetsregisteretOrg";
import { hentOverordnetEnhetApiLink, hentUnderenhetApiLink } from "../lenker";

export async function hentUnderenhet(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(hentUnderenhetApiLink(orgnr));
  if (respons.ok) {
    const enhet: EnhetsregisteretOrg = await respons.json();
    return enhet;
  }
  return tomEnhetsregOrg;
}

export async function hentOverordnetEnhet(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  if (orgnr !== "") {
    let respons = await fetch(hentOverordnetEnhetApiLink(orgnr));
    if (respons.ok) {
      const enhet: EnhetsregisteretOrg = await respons.json();
      return enhet;
    }
  }
  return tomEnhetsregOrg;
}
