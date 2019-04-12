import { pamHentStillingsannonserLenke } from "./lenker";

export interface PamStatusAnnonser {
  TIL_GODKJENNING: number;
  GODKJENT: number;
  PAABEGYNT: number;
  TIL_AVSLUTTING: number;
  AVSLUTTET: number;
  AVVIST: number;
  PUBLISERT: number;
}

//TODO TAG-378: finne ut hvilke annonser som regner som "aktive"

const hentAntallannonser = async (): Promise<number> => {
  const respons = await fetch(pamHentStillingsannonserLenke(), {
    method: "GET",
    credentials: "include"
  });
  if (respons.ok) {
    const responsBody: PamStatusAnnonser = await respons.json();
    return Object.values(responsBody).reduce((a, b) => a + b);
  }
  // TODO TAG-378 Hvordan burde vi håndtere denne feilen? Snakke med resten av teamet
  return 0;
};

export default hentAntallannonser;
