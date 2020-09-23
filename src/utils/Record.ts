export const fromEntries: <Key extends string, T>(entries: [Key, T][]) => Record<Key, T> =
    Object.fromEntries;

export const keys: <Key extends string, T>(record: Record<Key, T>) => Key[] =
    Object.keys;

export const values: <Key extends string, T>(record: Record<Key, T>) => T[] =
    Object.values;

export const map = <Key extends string, From, To>(
    input: Record<Key, From>,
    f: (_: From) => To
): Record<Key, To> => {
    const output = {} as Record<Key, To>;

    for (let key of Object.keys(input) as Key[]) {
        output[key] = f(input[key]);
    }

    return output;
};

export const forEach = <Key extends string, T>(
    obj: Record<Key, T>,
    f: (key: Key, value: T) => void
): void => {
    for (let key of Object.keys(obj) as Key[]) {
        f(key, obj[key]);
    }
};

export const length = <Key extends string, T>(obj: Record<Key, T>): number =>
    Object.keys(obj).length;
