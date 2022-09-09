
export const fromEntries: <Key extends string, Value>(entries: [Key, Value][]) => Record<Key, Value> =
    Object.fromEntries;

export const keys: <Key extends string, Value>(record: Record<Key, Value>) => Key[] =
    Object.keys;

export const values: <Key extends string, Value>(record: Record<Key, Value>) => Value[] =
    Object.values;

export const entries: <Key extends string, Value>(record: Record<Key, Value>) => [Key, Value][] =
    Object.entries;

export const map = <Key extends string, FromValue, ToValue>(
    input: Record<Key, FromValue>,
    f: (key: Key, value: FromValue) => ToValue
): Record<Key, ToValue> => {
    const output = {} as Record<Key, ToValue>;

    for (let key of keys(input)) {
        output[key] = f(key, input[key]);
    }

    return output;
};

export const forEach = <Key extends string, Value>(
    obj: Record<Key, Value>,
    f: (key: Key, value: Value) => void
): void => {
    for (let key of keys(obj)) {
        f(key, obj[key]);
    }
};

export const length = <Key extends string, Value>(obj: Record<Key, Value>): number =>
    Object.keys(obj).length;

export const mapToArray = <Key extends string, FromValue, ToValue>(
    record: Record<Key, FromValue>,
    f: (k: Key, v:FromValue) => ToValue
): ToValue[] => {
    const result = []

    for (let [key, value] of entries(record)) {
        result.push(f(key, value))
    }

    return result
}
