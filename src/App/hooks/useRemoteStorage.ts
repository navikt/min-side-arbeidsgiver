import {useEffect, useReducer} from "react";
import {
    deleteStorage,
    getStorage,
    putStorage,
    StorageError,
    StorageItem,
    StorageItemConflict, StorageItemDeleted, StorageItemLoaded,
    StorageItemResponse, StorageItemUpdated
} from "../../api/dnaApi";

type RemoteStorageAction =
    | { type: 'storage-loading' }
    | { type: 'storage-failed', error: any }
    | { type: 'storage-error', error: StorageError }
    | { type: 'storage-loaded', loadedStorageItem: StorageItem }
    | { type: 'storage-updated', updatedStorageItem: StorageItem }
    | { type: 'storage-deleted', deletedStorageItem: StorageItem }
    | { type: 'storage-conflict', storageItemConflict: StorageItemConflict }
type RemoteStorageState<S> = {
    isLoading: boolean,
    error: any,
    storedValue: S | null,
    storageItem: StorageItem | null,
    storageItemConflict: StorageItemConflict | null,
}
function remoteStorageReducer<S>(parser: (value: any) => S) {
    return (currentState : RemoteStorageState<S>, action: RemoteStorageAction) => {
        console.log("remoteStorageReducer", action.type, action);
        // TODO: close over parser
        if (action.type === 'storage-loading') {
            return {
                ...currentState,
                error: null,
                storageItemConflict: null,
                storageItem: null,
                isLoading: true,
            };
        }
        if (action.type === 'storage-error') {
            return {
                ...currentState,
                error: action.error,
                storageItemConflict: null,
                storageItem: null,
                isLoading: false,
            }
        }
        if (action.type === 'storage-loaded') {
            console.log("storage-loaded", action.loadedStorageItem.data, parser(action.loadedStorageItem.data));
            return {
                ...currentState,
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
                error: null,
                storageItemConflict: action.storageItemConflict,
                storageItem: null,
                isLoading: false,
            }
        }
        if (action.type === 'storage-failed') {
            return {
                ...currentState,
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
    setValue: (value: S) => void,
    deleteValue: () => void,
}

export const useRemoteStorage = <S>(
    key: string,
    initialValue: S,
    parser: (value: any) => S,
): UseRemoteStorage<S> => {

    const [state, dispatch] = useReducer(remoteStorageReducer(parser), {
        isLoading: false,
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
            console.log("resolveToState", response);
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
                // TODO: this should never happen
            }
        } catch (error) {
            dispatch({
                type: 'storage-failed',
                error: error
            })
        }
    }

    useEffect(() => {
        resolveToState(getStorage(key))
    }, []);

    const setValue = async (value: S) => {
        console.log("setValue", state.storageItem?.version);
        const valueToStore = value instanceof Function ? value(state.storedValue) : value;
        await resolveToState(putStorage(key, valueToStore, state.storageItem?.version))
    };

    const deleteValue = async () => {
        await resolveToState(deleteStorage(key, state.storageItem?.version))
    }

    return {
        error: state.error,
        isLoading: state.isLoading,
        storageItem: state.storageItem,
        storageItemConflict: state.storageItemConflict,
        storedValue: state.storedValue,
        setValue,
        deleteValue
    };
}