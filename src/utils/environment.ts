interface Environment {
    MILJO: string
    BRUKER_API_URL: string
}

const environment: Environment = {
    MILJO: 'local',
    ...(window as any)?.environment
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
        case 'prod-gcp':
            return e.prod
        case 'labs-gcp':
            return e.labs ? e.labs : e.other
        default:
            return e.other
    }
}

export default environment;

