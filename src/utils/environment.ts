import {altinnUrl} from "../api/altinnApi";

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

caseMiljo({
    prod: () => {
        // noop
    },
    other: () => {
        fetch('/min-side-arbeidsgiver/debug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Ukjent miljø i frontend',
                environment,
                userAgent: navigator.userAgent,
                url: window.location.href,
            }),
        });
    }
})

export default environment;

