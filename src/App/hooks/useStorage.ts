import {useEffect, useState} from "react";
import * as Sentry from "@sentry/browser";
import {deleteStorage, getStorage, putStorage, StorageItem} from "../../api/dnaApi";

export type UseStorage<S> = [
    S, /* value */
    (value: S) => void, /* update */
    () => void, /* delete */
]

export const useLocalStorage = <S>(
    key: string,
    initialValue: S | ((v: S) => S),
): UseStorage<S> =>
    useStorage(window.localStorage, key, initialValue)

export const useSessionStorage = <S>(
    key: string,
    initialValue: S | ((v: S) => S),
): UseStorage<S> =>
    useStorage(window.sessionStorage, key, initialValue)

export const useRemoteStorage = <S>(
    key: string,
    initialValue: S,
    parser: (value: any) => S,
): UseStorage<S> => {


    const [storedValue, setStoredValue] = useState<S>(initialValue);
    const [storageItem, setStorageItem] = useState<StorageItem | null>(null);


    async function getAndSetStorageItemFromApi() {
        try {
            const item = await getStorage(key);
            setStorageItem(item);
            setStoredValue(parser(item.data));
        } catch (error) {
            console.error(error);
            Sentry.captureException(error);
        }
    }

    useEffect(() => {
        getAndSetStorageItemFromApi()
    }, []);

    const setValue = async (value: S) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            await putStorage(key, valueToStore, storageItem?.version)
            await getAndSetStorageItemFromApi()
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    const deleteValue = async () => {
        await deleteStorage(key, storageItem?.version)
        setStorageItem(null)
        setStoredValue(initialValue);
    }

    return [storedValue, setValue, deleteValue];
}

function useStorage<S>(
    storage: Storage,
    key: string,
    initialValue: S | ((v: S) => S)
): UseStorage<S>  {
    const [storedValue, setStoredValue] = useState<S>(() => {
        try {
            const item = storage.getItem(key);
            return item !== null ? JSON.parse(item) : initialValue;
        } catch (error) {
            Sentry.captureException(error);
            return initialValue;
        }
    });

    const setValue = (value: S) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            storage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            Sentry.captureException(error);
        }
    };

    const deleteValue = () => {
        storage.removeItem(key)
    }

    return [storedValue, setValue, deleteValue];
}