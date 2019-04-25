import {
  EnhetsregisteretOrg,
  naeringskode1,
  naeringskode2,
  naeringskode3,
  organisasjonsform,
  postadresse
} from "../enhetsregisteretOrg";
import { enhetsregisteretApiLink } from "../lenker";

export async function hentBedriftsInfo(
  orgnr: string
): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(enhetsregisteretApiLink(orgnr));
  const enhet = await respons.json();
  const {
    underTvangsavviklingEllerTvangsopplosning,
    underAvvikling,

    ...annet
  } = enhet;
  return annet;
}
