/**
 * Creates an object from an array of key-value pairs.
 */
export const fromEntries: <Key extends string, Value>(
    entries: [Key, Value][]
) => Record<Key, Value> = Object.fromEntries;

/**
 * Returns the keys of the record as an array.
 */
export const keys: <Key extends string, Value>(record: Record<Key, Value>) => Key[] = Object.keys;

/**
 * Returns the values of the record as an array.
 */
export const values: <Key extends string, Value>(record: Record<Key, Value>) => Value[] =
    Object.values;

/**
 * Returns the entries of the record as an array of [key, value] pairs.
 */
export const entries: <Key extends string, Value>(record: Record<Key, Value>) => [Key, Value][] =
    Object.entries;

/**
 * Creates a new record by applying a function to each key-value pair in the input record.
 */
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

/**
 * Iterates over each key-value pair in the object and applies the given function.
 */
export const forEach = <Key extends string, Value>(
    obj: Record<Key, Value>,
    f: (key: Key, value: Value) => void
): void => {
    for (let key of keys(obj)) {
        f(key, obj[key]);
    }
};

/**
 * Returns the number of key-value pairs in the object.
 */
export const length = <Key extends string, Value>(obj: Record<Key, Value>): number =>
    Object.keys(obj).length;

/**
 * Creates an array by applying a function to each key-value pair in the record.
 */
export const mapToArray = <Key extends string, FromValue, ToValue>(
    record: Record<Key, FromValue>,
    f: (k: Key, v: FromValue) => ToValue
): ToValue[] => {
    const result = [];

    for (let [key, value] of entries(record)) {
        result.push(f(key, value));
    }

    return result;
};

/**
 * Creates a new object by picking the specified keys from the original object.
 */
export const pick = <Key extends string, Value, SelectedKey extends readonly Key[]>(
    record: Record<Key, Value>,
    ...keys: SelectedKey
): Record<SelectedKey[number], Value> => {
    const result = {} as Record<SelectedKey[number], Value>;

    for (const key of keys) {
        result[key] = record[key];
    }

    return result;
};

/**
 * Returns true if any value in the record satisfies the predicate.
 */
export const any = <Key extends string, Value>(
    record: Record<Key, Value>,
    predicate: (value: Value, key: Key) => boolean
): boolean => {
    for (let key of keys(record)) {
        if (predicate(record[key], key)) {
            return true;
        }
    }

    return false;
};

/**
 * Returns true if all values in the record satisfy the predicate.
 */
export const all = <Key extends string, Value>(
    record: Record<Key, Value>,
    predicate: (value: Value, key: Key) => boolean
): boolean => {
    for (let key of keys(record)) {
        if (!predicate(record[key], key)) {
            return false;
        }
    }

    return true;
};
