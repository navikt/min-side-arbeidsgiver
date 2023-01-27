export const delayed = <T extends any>(delay: number, fn: () => T): Promise<T> =>
    new Promise((res) => setTimeout(res, 1000)).then(fn);

export const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));


/** Number of elements in array that statisfy predicate.
 * Efficient implementation of "count(xs, p) === xs.filter(p).length",
 * as it won't create the whole filtered array.
 */
export const count = <T>(xs: T[], p: (x: T) => boolean): number =>
    xs.reduce(((count, x) => p(x) ? count + 1 : count), 0)

export const sum = <T>(xs: T[], f: (x: T) => number): number =>
    xs.reduce((sum, x) => sum + f(x), 0)

export const sorted = <T extends any>(array: T[], on: (e:T) => string): T[] =>
    [...array].sort((a, b) => on(a).localeCompare(on(b)));