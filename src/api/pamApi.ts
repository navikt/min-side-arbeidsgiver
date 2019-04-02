import { pamApiLink } from "../lenker";

export async function settBedriftIPamOgReturnerTilgang(
  orgnr: string
): Promise<boolean> {
  let respons = await fetch(pamApiLink(orgnr));
  return !!respons.ok;
}
