import { pamSettBedriftLenke } from "../lenker";

export async function settBedriftIPamOgReturnerTilgang(
  orgnr: string
): Promise<boolean> {
  let respons = await fetch(pamSettBedriftLenke(orgnr), {
    method: "GET",
    credentials: "include"
  });
  return !!respons.ok;
}
