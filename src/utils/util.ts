import { Organisasjon } from '../Pages/OrganisasjonerOgTilgangerProvider';

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
