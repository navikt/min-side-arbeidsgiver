import { useEffect, useState } from 'react';

export const useEffectfulFunction = <Func extends (...args: any[]) => T, T>(
    init: T | (() => T),
    func: Func,
    args: Parameters<Func>
): T => {
    const [value, setValue] = useState<T>(init);
    useEffect(() => {
        setValue(func(...args));
    }, args);
    return value;
};

export const useEffectfulAsyncFunction = <T, Func extends (...args: any[]) => Promise<T>>(
    init: T,
    func: Func,
    args: Parameters<Func>
): [T | undefined, Error | undefined] => {
    const [result, setResult] = useState<[T | undefined, Error | undefined]>([init, undefined]);
    useEffect(() => {
        func(...args)
            .then((value) => setResult([value, undefined]))
            .catch((error) => setResult([undefined, error]));
    }, args);
    return result;
};
