import {useState} from "react";
import * as Sentry from "@sentry/browser";

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