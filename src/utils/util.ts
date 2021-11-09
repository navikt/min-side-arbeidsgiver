export const delayed = <T extends any>(delay: number, fn: () => T): Promise<T> =>
    new Promise((res) => setTimeout(res, 1000)).then(fn);

export const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));
