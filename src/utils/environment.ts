const environment = {
    MILJO: (window as any)?.appSettings?.MILJO ?? 'local'
};

interface Miljo<T> {
    prod: T;
    other: T;
}

export const gittMiljo = <T>(e: Miljo<T>): T =>
    environment.MILJO === 'prod-sbs' ? e.prod : e.other;

export default environment;
