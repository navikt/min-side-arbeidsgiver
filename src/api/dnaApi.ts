import {digiSyfoNarmesteLederURL, digiSyfoVirksomheterURL, refusjonstatusURL, sjekkInnloggetURL} from '../lenker';
import {Organisasjon} from '../altinn/organisasjon';
import {z} from "zod";
import * as Sentry from "@sentry/browser";

interface SyfoKallObjekt {
    tilgang: boolean;
}

const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.map(z.string(), z.number()),
    tilgang: z.boolean()
});
const RefusjonStatusResponse = z.array(RefusjonStatus);
export type RefusjonStatus = z.infer<typeof RefusjonStatus>;


export async function hentSyfoTilgang(): Promise<boolean> {
    const respons = await fetch(digiSyfoNarmesteLederURL);
    if (respons.ok) {
        const syfoTilgang: SyfoKallObjekt = await respons.json();
        return syfoTilgang.tilgang;
    }
    throw new Error('Feil ved kontakt mot baksystem.');
}

export async function hentSyfoVirksomheter(): Promise<Organisasjon[]> {
    const respons = await fetch(digiSyfoVirksomheterURL);
    if (respons.ok) {
        return await respons.json();
    }
    throw new Error('Feil ved kontakt mot baksystem.');
}

export async function hentRefusjonstatus(): Promise<RefusjonStatus[]> {
    const respons = await fetch(refusjonstatusURL);
    if (respons.ok) {
        const data = await respons.json();
        try {
            return RefusjonStatusResponse.parse(data);
        } catch (error) {
            Sentry.captureException(error)
            return data
        }
    }
    throw new Error('Feil ved kontakt mot baksystem.');
}

export const sjekkInnlogget = async (): Promise<boolean> => {
    const {ok} = await fetch(sjekkInnloggetURL)
    return ok
}

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    const respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}
