import { pamHentStillingsannonserLenke } from "./lenker";
import { logInfo} from "./utils/metricsUtils";

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
  logInfo('hent annonser');
  const respons = await fetch(pamHentStillingsannonserLenke(), {
    method: "GET",
    credentials: "include"
  });
  if (respons.ok) {
    const responsBody: PamStatusAnnonser = await respons.json();
    return responsBody.PUBLISERT;
  }
  // TODO TAG-378 Hvordan burde vi håndtere denne feilen? Snakke med resten av teamet
  return 0;
};

export default hentAntallannonser;
