import { Organisasjon } from "../organisasjon";
import { SyfoKallObjekt } from "../syfoKallObjekt";
import { digiSyfoNarmesteLederLink } from "../lenker";
import {logInfo} from "../utils/metricsUtils";

export async function hentOrganisasjoner(): Promise<Array<Organisasjon>> {
  let respons = await fetch("/ditt-nav-arbeidsgiver/api/organisasjoner");
  if (respons.ok) {
    return await respons.json();
  } else {
    return [];
  }
}

export async function hentSyfoTilgang(): Promise<boolean> {
  let respons = await fetch(digiSyfoNarmesteLederLink);
  if (respons.ok) {
    const objekt: SyfoKallObjekt = await respons.json();
    if (objekt.narmesteLedere.length) {
      logInfo("har syfotilgang");
      return true;
    }
  }
  return false;
}

