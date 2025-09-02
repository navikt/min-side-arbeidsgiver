import { useState } from 'react';

export type UseStorage<S> = [
    S /* value */,
    (value: S | ((prev: S) => S)) => void /* update */,
    () => void /* delete */,
];

export const useLocalStorage = <S>(key: string, initialValue: S | (() => S)): UseStorage<S> =>
    useStorage(window.localStorage, key, initialValue);

export const useSessionStorage = <S>(
    key: string,
    initialValue: S | (() => S),
    reviver?: (key: string, value: any) => S,
    freezer?: (this: any, key: string, value: any) => any
): UseStorage<S> => useStorage(window.sessionStorage, key, initialValue, reviver, freezer);

export const usePrefixedLocalStorage = <S>(
    id: string,
    prefix: string,
    initialValue: S | (() => S)
): UseStorage<S> => useLocalStorage(`${prefix}${id}`, initialValue);

function useStorage<S>(
    storage: Storage,
    key: string,
    initialValue: S | (() => S),
    reviver: (key: string, value: any) => S = (_key, value) => value as S,
    freezer: (this: any, key: string, value: any) => any = (_k, v) => v
): UseStorage<S> {
    const [storedValue, setStoredValue] = useState<S>(() => {
        try {
            const item = storage.getItem(key);
            return item !== null
                ? JSON.parse(item, reviver)
                : initialValue instanceof Function
                  ? initialValue()
                  : initialValue;
        } catch (error) {
            console.error('#MSA: useStorage initState feilet.', error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    });

    const setValue = (value: S | ((prev: S) => S)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            storage.setItem(key, JSON.stringify(valueToStore, freezer));
        } catch (error) {
            console.error('#MSA: useStorage setValue feilet', error);
        }
    };

    const deleteValue = () => {
        storage.removeItem(key);
    };

    return [storedValue, setValue, deleteValue];
}
