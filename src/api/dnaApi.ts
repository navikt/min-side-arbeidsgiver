import {digiSyfoVirksomheterURL, refusjonstatusURL, sjekkInnloggetURL} from '../lenker';
import {Organisasjon} from '../altinn/organisasjon';
import {z} from "zod";
import * as Sentry from "@sentry/browser";

const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.object({
        "KLAR_FOR_INNSENDING": z.number().optional(),
    }),
    tilgang: z.boolean()
});
const RefusjonStatusResponse = z.array(RefusjonStatus);
export type RefusjonStatus = z.infer<typeof RefusjonStatus>;

const DigiSyfoOrganisasjon = z.object({
    organisasjon: Organisasjon,
    antallSykmeldinger: z.number(),
});
const DigiSyfoOrganisasjonResponse = z.array(DigiSyfoOrganisasjon);
export type DigiSyfoOrganisasjon = z.infer<typeof DigiSyfoOrganisasjon>;
export type DigiSyfoOrganisasjonResponse = z.infer<typeof DigiSyfoOrganisasjonResponse>;

export async function hentSyfoVirksomheter(): Promise<DigiSyfoOrganisasjonResponse> {
    const respons = await fetch(digiSyfoVirksomheterURL);
    if (respons.ok) {
        return DigiSyfoOrganisasjonResponse.parse(await respons.json());
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
