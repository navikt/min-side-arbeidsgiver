interface Environment {
    MILJO: string,
    NAIS_CLUSTER_NAME: string,
    NAIS_APP_IMAGE: string,
    GIT_COMMIT: string,
}

const environment: Environment = {
    MILJO: 'local',
    NAIS_APP_IMAGE: 'unknown',
    NAIS_CLUSTER_NAME: 'unknown',
    GIT_COMMIT: 'unknown',
    ...(window as any)?.environment
};

interface Miljo<T> {
    prod: T;
    demo?: T;
    dev?: T;
    other: T;
}

export const gittMiljo = <T>(e: Miljo<T>): T => {
    switch (environment.MILJO) {
        case 'prod':
            return e.prod
        case 'dev':
            return e.hasOwnProperty('dev') ? e.dev! : e.other;
        case 'demo':
            return e.hasOwnProperty('demo') ? e.demo! : e.other
        default:
            return e.other
    }
}

export const caseMiljo = <T>(e: Miljo<(miljo: string) => T>): T =>
    gittMiljo(e)(environment.MILJO)

export default environment;

