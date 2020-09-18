import { pamSettBedriftLenke } from "../lenker";

export const settBedriftIPamOgReturnerTilgang = (orgnr: string): Promise<boolean> =>
    fetch(pamSettBedriftLenke(orgnr), {
        method: "GET",
        credentials: "include"
    })
        .then(_ => _.ok);
