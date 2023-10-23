import {useEffect, useReducer} from "react";
import {
    deleteStorage,
    getStorage,
    putStorage,
    StorageError,
    StorageItem,
    StorageItemConflict,
    StorageItemDeleted,
    StorageItemLoaded,
    StorageItemResponse,
    StorageItemUpdated
} from "../api/storageApi";

type RemoteStorageAction<S> =
    | { type: 'storage-loading' }
    | { type: 'storage-failed', error: any }
    | { type: 'storage-error', error: StorageError }
    | { type: 'storage-loaded', loadedStorageItem: StorageItem }
    | { type: 'storage-updated', updatedStorageItem: StorageItem }
    | { type: 'storage-deleted', deletedStorageItem: StorageItem }
    | { type: 'storage-conflict', storageItemConflict: StorageItemConflict }
type RemoteStorageState<S> = {
    status: 'initializing' | 'loading'| 'error'| 'loaded'| 'updated'| 'deleted'| 'conflict',
    error: any,
    storedValue: S | null,
    storageItem: StorageItem | null,
    storageItemConflict: StorageItemConflict | null,
}
function remoteStorageReducer<S>(parser: (value: any[]) => S) : (currentState : RemoteStorageState<S>, action: RemoteStorageAction<S>) => RemoteStorageState<S> {
    return (currentState : RemoteStorageState<S>, action: RemoteStorageAction<S>) => {
        if (action.type === 'storage-loading') {
            return {
                ...currentState,
                status: 'loading',
                error: null,
                storageItemConflict: null,
                storageItem: null,
            };
        }
        if (action.type === 'storage-error') {
            return {
                ...currentState,
                status: 'error',
                error: action.error,
                storageItemConflict: null,
                storageItem: null,
            }
        }
        if (action.type === 'storage-loaded') {
            return {
                ...currentState,
                status: 'loaded',
                error: null,
                storageItemConflict: null,
                storageItem: action.loadedStorageItem,
                storedValue: parser(action.loadedStorageItem.data),
                isLoading: false,
            }
        }
        if (action.type === 'storage-updated') {
            return {
                ...currentState,
                status: 'updated',
                error: null,
                storageItemConflict: null,
                storageItem: action.updatedStorageItem,
                storedValue: parser(action.updatedStorageItem.data),
                isLoading: false,
            }
        }
        if (action.type === 'storage-deleted') {
            return {
                ...currentState,
                status: 'deleted',
                error: null,
                storageItemConflict: null,
                storageItem: action.deletedStorageItem,
                storedValue: null,
                isLoading: false,
            }
        }
        if (action.type === 'storage-conflict') {
            return {
                ...currentState,
                status: 'conflict',
                error: null,
                storageItemConflict: action.storageItemConflict,
                storageItem: null,
                isLoading: false,
            }
        }
        if (action.type === 'storage-failed') {
            return {
                ...currentState,
                status: 'error',
                error: action.error,
                storageItemConflict: null,
                storageItem: null,
                isLoading: false,
            }
        }

        throw Error("Unknown action.");
    }
}

export type UseRemoteStorage<S> = RemoteStorageState<S> & {
    setValue: (value: S, version?: string | null) => void,
    deleteValue: () => void,
    reload: () => void,
}

export const useRemoteStorage = <S>(
    key: string,
    initialValue: S,
    parser: (value: any) => S,
): UseRemoteStorage<S> => {

    const [state, dispatch] = useReducer(remoteStorageReducer(parser), {
        status: 'initializing',
        error: null,
        storedValue: initialValue,
        storageItem: null,
        storageItemConflict: null,
    });

    async function resolveToState(promise: Promise<StorageItemResponse>) {
        try {
            dispatch({
                type: 'storage-loading'
            });
            const response = await promise;
            if ((response as StorageError).error !== undefined) {
                dispatch({
                    type: 'storage-error',
                    error: (response as StorageError).error
                });
            } else if ((response as StorageItemLoaded).loadedStorageItem !== undefined) {
                dispatch({
                    type: 'storage-loaded',
                    loadedStorageItem: (response as StorageItemLoaded).loadedStorageItem,
                })
            } else if ((response as StorageItemUpdated).updatedStorageItem !== undefined) {
                dispatch({
                    type: 'storage-updated',
                    updatedStorageItem: (response as StorageItemUpdated).updatedStorageItem,
                })
            } else if ((response as StorageItemDeleted).deletedStorageItem !== undefined) {
                dispatch({
                    type: 'storage-deleted',
                    deletedStorageItem: (response as StorageItemDeleted).deletedStorageItem,
                })
            } else if ((response as StorageItemConflict).currentStorageItem !== undefined) {
                dispatch({
                    type: 'storage-conflict',
                    storageItemConflict: (response as StorageItemConflict),
                })
            } else {
                // this should never happen
                dispatch({
                    type: 'storage-failed',
                    error: `Unknown response type ${response}`
                })
            }
        } catch (error) {
            dispatch({
                type: 'storage-failed',
                error: error
            })
        }
    }

    useEffect(() => {
        loadValue();
    }, []);

    const loadValue = async () => {
        await resolveToState(getStorage(key))
    }

    const setValue = async (value: S, version: string | null = null) => {
        const versionToUse = (version !== null ? version : state.storageItem?.version) ?? '0';
        const valueToStore = value instanceof Function ? value(state.storedValue) : value;
        await resolveToState(putStorage(key, valueToStore, versionToUse))
    };

    const deleteValue = async () => {
        await resolveToState(deleteStorage(key, state.storageItem?.version))
    }

    return {
        ...state,
        setValue,
        deleteValue,
        reload: loadValue,
    };
}