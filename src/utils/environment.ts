const environment = {
    MILJO: (window as any)?.appSettings?.MILJO ?? 'local'
};

interface Miljo<T> {
    prod: T;
    labs?: T;
    other: T;
}

export const gittMiljo = <T>(e: Miljo<T>): T=> {
    switch (environment.MILJO) {
        case 'prod-sbs':
            return e.prod
        case 'labs-gcp':
            return e.labs ? e.labs : e.other
        default:
            return e.other
    }
}

export default environment;

