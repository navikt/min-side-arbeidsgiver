import {Organisasjon} from '../altinn/organisasjon';
import {z} from "zod";
import * as Sentry from "@sentry/browser";
import {gittMiljo} from "../utils/environment";


const digiSyfoVirksomheterURL = '/min-side-arbeidsgiver/api/narmesteleder/virksomheter-v3';
const DigiSyfoOrganisasjon = z.object({
    organisasjon: Organisasjon,
    antallSykmeldte: z.number(),
});
const DigiSyfoOrganisasjonResponse = z.array(DigiSyfoOrganisasjon);
export type DigiSyfoOrganisasjon = z.infer<typeof DigiSyfoOrganisasjon>;
export type DigiSyfoOrganisasjonResponse = z.infer<typeof DigiSyfoOrganisasjonResponse>;

export async function hentSyfoVirksomheter(): Promise<DigiSyfoOrganisasjonResponse> {
    const respons = await fetch(digiSyfoVirksomheterURL);
    if (respons.ok) {
        return DigiSyfoOrganisasjonResponse.parse(await respons.json());
    }
    throw new Error(`Kall til ${digiSyfoVirksomheterURL} feilet med ${respons.status}:${respons.statusText}`);
}


const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.object({
        "KLAR_FOR_INNSENDING": z.number().optional(),
    }),
    tilgang: z.boolean()
});
const RefusjonStatusResponse = z.array(RefusjonStatus);
export type RefusjonStatus = z.infer<typeof RefusjonStatus>;

const refusjonstatusURL = '/min-side-arbeidsgiver/api/refusjon_status';
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
    throw new Error(`Kall til ${refusjonstatusURL} feilet med ${respons.status}:${respons.statusText}`);
}


const sjekkInnloggetURL = '/min-side-arbeidsgiver/api/innlogget';
export const sjekkInnlogget = async (): Promise<boolean> => {
    const {ok} = await fetch(sjekkInnloggetURL)
    return ok
}

export async function hentOrganisasjoner(): Promise<Organisasjon[]> {
    const respons = await fetch('/min-side-arbeidsgiver/api/organisasjoner');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error(`Kall til '/min-side-arbeidsgiver/api/organisasjoner' feilet med ${respons.status}:${respons.statusText}`);
    }
}
export async function getStorage(key: string): Promise<StorageItem> {
    const storageUrl = `/min-side-arbeidsgiver/api/storage/${key}`;
    const respons = await fetch(storageUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    if (respons.ok) {
        const data = await respons.json();

        try {
            return {
                key: key,
                data,
                version: respons.headers.get('version'),
            };
        } catch (error) {
            Sentry.captureException(error)
        }
    }
    throw new Error(`GET Kall til ${storageUrl} feilet med ${respons.status}:${respons.statusText}`);
}

export async function putStorage(key: string, data: any, version: string | null = null): Promise<void> {
    const storageUrl = `/min-side-arbeidsgiver/api/storage/${key}`;

    const respons = await fetch(storageUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(version !== null ? {version} : {}),
        },
        body: JSON.stringify(data),
    });
    if (respons.ok) {
        // noop
        return;
    }
    if (respons.status === 409) {
        // TODO: handle conflict
    }

    throw new Error(`PUT Kall til ${storageUrl} feilet med ${respons.status}:${respons.statusText}`);
}

export async function deleteStorage(key: string, version: string | null = null): Promise<void> {
    const storageUrl = `/min-side-arbeidsgiver/api/storage/${key}`;

    const respons = await fetch(storageUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(version !== null ? {version} : {}),
        },
    });
    if (respons.ok) {
        // noop
        return;
    }
    if (respons.status === 409) {
        // TODO: handle conflict
    }

    throw new Error(`DELETE Kall til ${storageUrl} feilet med ${respons.status}:${respons.statusText}`);
}
export type StorageItem = {
    key: string,
    data: any,
    version: string | null,
}