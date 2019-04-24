import {
  EnhetsregisteretOrg,
  naeringskode1,
  naeringskode2,
  naeringskode3,
  organisasjonsform,
  postadresse
} from "../enhetsregisteretOrg";

export async function hentBedriftsInfo(): Promise<EnhetsregisteretOrg> {
  let respons = await fetch(
    "https://data.brreg.no/enhetsregisteret/api/enheter/889640782"
  );
  console.log("respons: ", respons);

  const enhet = await respons.json();

  const {
    underTvangsavviklingEllerTvangsopplosning,
    underAvvikling,

    ...annet
  } = enhet;

  return annet;
}
