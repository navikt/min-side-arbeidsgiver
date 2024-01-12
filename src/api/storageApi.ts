const storageUrl = `${__BASE_PATH__}/api/storage`;
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
