import { Organisasjon } from '../Pages/OrganisasjonerOgTilgangerContext';

export const delayed = <T extends any>(delay: number, fn: () => T): Promise<T> =>
    new Promise((res) => setTimeout(res, 1000)).then(fn);

export const randomInt = (max: number) => Math.floor(Math.random() * Math.floor(max));

/** Number of elements in array that statisfy predicate.
 * Efficient implementation of "count(xs, p) === xs.filter(p).length",
 * as it won't create the whole filtered array.
 */
export const count = <T>(xs: T[], p: (x: T) => boolean): number =>
    xs.reduce((count, x) => (p(x) ? count + 1 : count), 0);

export const sum = <T>(xs: T[], f: (x: T) => number): number =>
    xs.reduce((sum, x) => sum + f(x), 0);

export const sorted = <T extends any>(array: T[], on: (e: T) => string): T[] =>
    [...array].sort((a, b) => on(a).localeCompare(on(b)));

export const erDriftsforstyrrelse = (httpStatus: number) => [502, 503, 504].includes(httpStatus);
export const erUnauthorized = (httpStatus: number) => 401 === httpStatus;

const ignorables = [
    'Load failed',
    'Failed to fetch',
    'NetworkError when attempting to fetch resource.',
    'cancelled',
    'avbrutt',
    'cancelado',
    'anulowane',
    'avbruten',
    'anulat',
    'The operation was aborted.',
];
export const erStøy = (error: any) =>
    erDriftsforstyrrelse(error.status) ||
    erUnauthorized(error.status) ||
    ignorables.includes(error.message);

export const splittListe = <T extends any>(liste: T[], filter: (e: T) => boolean): T[][] => {
    const selected = liste.filter(filter);
    const rejected = liste.filter((e) => !filter(e));
    return [selected, rejected];
};

export const capitalize = (s: string): string => {
    const [forbokstav, ...resten] = s;
    return [forbokstav.toUpperCase(), ...resten].join('');
};

export const formatOrgNr = (orgNr: string): string =>
    orgNr.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

/**
 * Denne funksjonen tar en trestruktur og returnerer en flat liste av alle løvnoder og dems første ledd parent.
 * mellomledd vil ikke være med i resultatet, med mindre de er direkte parent av en løvnode.
 */
export const flatUtTre = (organisasjonstre: Organisasjon[]): Organisasjon[] => {
    const mapR = (parent: Organisasjon): Organisasjon[] => {
        const [children, otherParents] = splittListe(
            parent.underenheter,
            (o) => o.underenheter.length === 0
        );
        return [
            ...(children.length > 0
                ? [
                      {
                          ...parent,
                          underenheter: children,
                      },
                  ]
                : []),
            ...otherParents.flatMap(mapR),
        ];
    };
    return organisasjonstre.flatMap((o) => mapR(o)).sort((a, b) => a.navn.localeCompare(b.navn));
};

/**
 * Denne funksjonen tar en trestruktur av organisasjoner og mapper over hver node i treet med den gitte mapping funksjonen.
 */
export const mapRecursive = <T extends Organisasjon>(list: T[], mapper: (o: T) => T): T[] => {
    return list.map((org) => {
        return {
            ...mapper({
                ...org,
                underenheter: mapRecursive(org.underenheter as T[], mapper),
            }),
        };
    });
};

/**
 * Denne funksjonen tar en trestruktur av organisasjoner og mapper alle noder til en flat liste, inklusiv alle mellomledd
 */
export const alleOrganisasjonerFlatt = (organisasjonstre: Organisasjon[]): Organisasjon[] => {
    const mapR = (parent: Organisasjon): Organisasjon[] => [
        parent,
        ...parent.underenheter.flatMap(mapR),
    ];
    return organisasjonstre.flatMap((o) => mapR(o));
};

export const mergeOrgTre = (first: Organisasjon[], second: Organisasjon[]): Organisasjon[] => {
    const map = new Map<string, Organisasjon>();

    [...first, ...second].forEach((org) => {
        if (map.has(org.orgnr)) {
            map.set(org.orgnr, mergeOrgs(map.get(org.orgnr)!, org));
        } else {
            map.set(org.orgnr, org);
        }
    });

    return Array.from(map.values());
};

const mergeOrgs = (orgA: Organisasjon, orgB: Organisasjon): Organisasjon => ({
    navn: orgA.navn,
    orgnr: orgA.orgnr,
    organisasjonsform: orgA.organisasjonsform,
    underenheter: mergeOrgTre(orgA.underenheter, orgB.underenheter),
});
