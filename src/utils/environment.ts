interface Environment {
    MILJO: string,
    NAIS_APP_IMAGE: string,
    GIT_COMMIT: string,
}

const environment: Environment = {
    MILJO: 'local',
    NAIS_APP_IMAGE: 'unknown',
    GIT_COMMIT: 'unknown',
    ...(window as any)?.environment
};

interface Miljo<T> {
    prod: T;
    labs?: T;
    dev?: T;
    other: T;
}

export const gittMiljo = <T>(e: Miljo<T>): T => {
    switch (environment.MILJO) {
        case 'prod-gcp':
            return e.prod
        case 'dev-gcp':
            return e.hasOwnProperty('dev') ? e.dev! : e.other;
        case 'labs-gcp':
            return e.hasOwnProperty('labs') ? e.labs! : e.other
        default:
            return e.other
    }
}

export const caseMiljo = <T>(e: Miljo<(miljo: string) => T>): T =>
    gittMiljo(e)(environment.MILJO)

export default environment;

