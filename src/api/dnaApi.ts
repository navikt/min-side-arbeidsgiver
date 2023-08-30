import { Organisasjon } from '../altinn/organisasjon';
import { z } from 'zod';
import * as Sentry from '@sentry/browser';
import { AltinntjenesteId } from '../altinn/tjenester';

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
    throw new Error(
        `Kall til ${digiSyfoVirksomheterURL} feilet med ${respons.status}:${respons.statusText}`
    );
}

const RefusjonStatus = z.object({
    virksomhetsnummer: z.string(),
    statusoversikt: z.object({
        KLAR_FOR_INNSENDING: z.number().optional(),
    }),
    tilgang: z.boolean(),
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
            Sentry.captureException(error);
        }
    }
    throw new Error(
        `Kall til ${refusjonstatusURL} feilet med ${respons.status}:${respons.statusText}`
    );
}

const sjekkInnloggetURL = '/min-side-arbeidsgiver/api/innlogget';
export const sjekkInnlogget = async (): Promise<boolean> => {
    const { ok } = await fetch(sjekkInnloggetURL);
    return ok;
};

const UserInfoRespons = z.object({
    altinnError: z.boolean(),
    organisasjoner: z.array(Organisasjon),
    tilganger: z.array(
        z.object({
            id: z.custom<AltinntjenesteId>(),
            tjenestekode: z.string(),
            tjenesteversjon: z.string(),
            organisasjoner: z.array(Organisasjon),
        })
    ),
});
export type UserInfo = z.infer<typeof UserInfoRespons>;
export async function hentUserInfo(): Promise<UserInfo> {
    const respons = await fetch('/min-side-arbeidsgiver/api/userInfo/v1');
    if (respons.ok) {
        return UserInfoRespons.parse(await respons.json());
    } else {
        throw new Error(
            `Kall til '/min-side-arbeidsgiver/api/userInfo/v1' feilet med ${respons.status}:${respons.statusText}`
        );
    }
}
const storageUrl = `/min-side-arbeidsgiver/api/storage`;
export async function getStorage(key: string): Promise<StorageItemResponse> {
    try {
        const respons = await fetch(`${storageUrl}/${key}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        if (respons.status === 204) {
            return {
                loadedStorageItem: {
                    key,
                    data: [],
                    version: respons.headers.get('version'),
                },
            };
        }
        const jsonResult = await respons.json();
        return {
            loadedStorageItem: {
                key,
                data: jsonResult,
                version: respons.headers.get('version'),
            },
        };
    } catch (error) {
        return { error };
    }
}

export async function putStorage(
    key: string,
    data: any,
    version: string | null = null
): Promise<StorageItemResponse> {
    try {
        const respons = await fetch(
            `${storageUrl}/${key}${version !== null ? `?version=${version}` : ''}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            }
        );

        if (respons.status === 409) {
            return {
                currentStorageItem: {
                    key,
                    data: await respons.json(),
                    version: respons.headers.get('version'),
                },
                rejectedStorageItem: {
                    key,
                    data,
                    version,
                },
            };
        } else if (respons.ok) {
            return {
                updatedStorageItem: {
                    key,
                    data: await respons.json(),
                    version: respons.headers.get('version'),
                },
            };
        } else {
            return {
                error: {
                    status: respons.status,
                    statusText: respons.statusText,
                },
            };
        }
    } catch (error) {
        return { error };
    }
}

export async function deleteStorage(
    key: string,
    version: string | null = null
): Promise<StorageItemResponse> {
    try {
        const respons = await fetch(
            `${storageUrl}/${key}${version !== null ? `?version=${version}` : ''}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
        if (respons.status === 409) {
            return {
                currentStorageItem: {
                    key,
                    data: await respons.json(),
                    version: respons.headers.get('version'),
                },
                rejectedStorageItem: null,
            };
        } else if (respons.ok) {
            return {
                deletedStorageItem: {
                    key,
                    data: await respons.json(),
                    version: respons.headers.get('version'),
                },
            };
        } else {
            return {
                error: {
                    status: respons.status,
                    statusText: respons.statusText,
                },
            };
        }
    } catch (error) {
        return { error };
    }
}
export type StorageItem = {
    key: string;
    data: any[];
    version: string | null;
};
export type StorageItemDeleted = {
    deletedStorageItem: StorageItem;
};
export type StorageItemUpdated = {
    updatedStorageItem: StorageItem;
};
export type StorageItemLoaded = {
    loadedStorageItem: StorageItem;
};
export type StorageItemConflict = {
    currentStorageItem: StorageItem;
    rejectedStorageItem: StorageItem | null;
};
export type StorageError = {
    error: any;
};
export type StorageItemResponse =
    | StorageItemLoaded
    | StorageItemUpdated
    | StorageItemDeleted
    | StorageItemConflict
    | StorageError;
