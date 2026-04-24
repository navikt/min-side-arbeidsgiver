import React, { useContext, useEffect, useMemo } from 'react';
import * as Record from '../utils/Record';
import { AltinntjenesteId } from '../altinn/tjenester';
import { useUserInfo } from '../hooks/useUserInfo';
import { AlertContext } from './Alerts';
import { organisasjonStrukturFlatt, mapRecursive, mergeOrgTre } from '../utils/util';
import { findRecursive } from '@navikt/virksomhetsvelger';

export type orgnr = string;

export interface Organisasjon {
    orgnr: string;
    organisasjonsform: string;
    navn: string;
    roller?: string[];
    underenheter: Organisasjon[];
}

export type OrganisasjonInfo = {
    øversteLedd: Organisasjon | undefined;
    parent: Organisasjon | undefined;
    organisasjon: Organisasjon;
    roller: string[];
    altinntilgang: Record<AltinntjenesteId, boolean>;
    syfotilgang: boolean;
    antallSykmeldte: number;
    vilkaarligAltinntilgang: boolean;
    refusjonstatustilgang: boolean; // true dersom man har noen refusjonstatuser > 0 på denne virksomheten
    refusjonstatus: {
        KLAR_FOR_INNSENDING?: number;
    };
};
export type OrganisasjonerOgTilgangerContext = {
    organisasjonstre: Organisasjon[];
    organisasjonsInfo: Record<orgnr, OrganisasjonInfo>;
    organisasjonerFlatt: Organisasjon[];
    // map av orgnr til dens parent. gitt et orgnr finner man dens parent
    orgnrTilParentMap: Map<string, string>;
    // map av orgnr til dens children. gitt et orgnr finner man alle direkte children
    orgnrTilChildrenMap: Map<string, string[]>;
};

export const OrganisasjonerOgTilgangerContext =
    React.createContext<OrganisasjonerOgTilgangerContext>(undefined!);

export const useOrganisasjonerOgTilgangerContext = () => {
    const organisasjonerOgTilgangerContext = useContext(OrganisasjonerOgTilgangerContext);
    if (organisasjonerOgTilgangerContext === undefined) {
        throw new Error(
            'OrganisasjonerOgTilgangerContext må brukes inne i en OrganisasjonerOgTilgangerProvider'
        );
    }
    return organisasjonerOgTilgangerContext;
};

export const useBeregnOrganisasjonsInfo = ():
    | {
          organisasjonsInfo: undefined;
          orgnrTilParentMap: undefined;
          orgnrTilChildrenMap: undefined;
          organisasjonerFlatt: undefined;
      }
    | {
          organisasjonsInfo: Record<string, OrganisasjonInfo>;
          orgnrTilParentMap: Map<string, string>;
          orgnrTilChildrenMap: Map<string, string[]>;
          organisasjonerFlatt: Organisasjon[];
      } => {
    const { userInfo } = useUserInfo();
    const { setSystemAlert } = useContext(AlertContext);

    useEffect(() => {
        setSystemAlert('UserInfoAltinn', userInfo?.altinnError ?? false);
        setSystemAlert('UserInfoDigiSyfo', userInfo?.digisyfoError ?? false);
    }, [userInfo]);

    return useMemo(() => {
        if (userInfo === undefined) {
            return {
                organisasjonsInfo: undefined,
                orgnrTilParentMap: undefined,
                orgnrTilChildrenMap: undefined,
                virksomheter: undefined,
            };
        }

        const altinnOrganisasjonerFlatt = organisasjonStrukturFlatt(userInfo.organisasjoner);
        const digisyfoOrganisasjonerFlatt = organisasjonStrukturFlatt(
            mapRecursive<Organisasjon>(userInfo.digisyfoOrganisasjoner, (org) => ({
                orgnr: org.orgnr,
                navn: org.navn,
                organisasjonsform: org.organisasjonsform,
                roller: [],
                underenheter: org.underenheter,
            }))
        );
        const alleOrganisasjonerFlatt: Organisasjon[] = [
            ...altinnOrganisasjonerFlatt,
            ...digisyfoOrganisasjonerFlatt,
        ];

        const orgnrTilParent = new Map(
            alleOrganisasjonerFlatt.flatMap((org) => {
                const parent = alleOrganisasjonerFlatt.find((it) =>
                    it.underenheter.some((it) => it.orgnr === org.orgnr)
                );
                if (parent === undefined) {
                    return [];
                }
                return [[org.orgnr, parent]];
            })
        );

        const organisasjonsInfo = Record.fromEntries(
            alleOrganisasjonerFlatt.map((org) => {
                const refusjonstatus = userInfo.refusjoner.find(
                    ({ virksomhetsnummer }) => virksomhetsnummer === org.orgnr
                );
                const altinnOrganisasjon = findRecursive(
                    userInfo.organisasjoner,
                    ({ orgnr }) => orgnr === org.orgnr
                );

                const digisyfoOrganisasjon = findRecursive(
                    userInfo.digisyfoOrganisasjoner,
                    ({ orgnr }) => orgnr === org.orgnr
                );
                const roller = altinnOrganisasjon?.roller ?? [];
                return [
                    org.orgnr,
                    {
                        øversteLedd: hentØversteLedd(org, orgnrTilParent),
                        parent: orgnrTilParent.get(org.orgnr),
                        organisasjon: {
                            ...org,
                            roller,
                        },
                        roller,
                        altinntilgang: Record.map(
                            userInfo.tilganger,
                            (_: AltinntjenesteId, orgnrMedTilgang: orgnr[]): boolean =>
                                orgnrMedTilgang.includes(org.orgnr)
                        ),
                        syfotilgang: digisyfoOrganisasjon !== undefined,
                        antallSykmeldte: digisyfoOrganisasjon?.antallSykmeldte ?? 0,
                        vilkaarligAltinntilgang: altinnOrganisasjonerFlatt.some(
                            ({ orgnr }) => orgnr === org.orgnr
                        ),
                        refusjonstatus: refusjonstatus?.statusoversikt ?? {},
                        refusjonstatustilgang: refusjonstatus?.tilgang ?? false,
                    },
                ];
            })
        );

        return {
            organisasjonsInfo,
            orgnrTilParentMap: new Map(
                Array.from(orgnrTilParent.entries()).map(([key, value]) => [key, value.orgnr])
            ),
            orgnrTilChildrenMap: Array.from(orgnrTilParent.entries()).reduce(
                (acc, [child, parent]) => {
                    const children = acc.get(parent.orgnr) ?? [];
                    acc.set(parent.orgnr, [...children, child]);
                    return acc;
                },
                new Map<string, string[]>()
            ),
            organisasjonerFlatt: alleOrganisasjonerFlatt,
        };
    }, [userInfo]);
};

export const useBeregnOrganisasjonstre = (): { organisasjonstre: Organisasjon[] } => {
    const { userInfo } = useUserInfo();

    return useMemo(() => {
        if (userInfo === undefined) {
            return { organisasjonstre: [] };
        }

        const organisasjonstre: Organisasjon[] = mergeOrgTre(
            userInfo.organisasjoner,
            mapRecursive<Organisasjon>(userInfo.digisyfoOrganisasjoner, (org) => ({
                orgnr: org.orgnr,
                navn: org.navn,
                organisasjonsform: org.organisasjonsform,
                roller: [],
                underenheter: org.underenheter,
            }))
        );

        return { organisasjonstre };
    }, [userInfo]);
};

export const hentØversteLedd = (
    org: Organisasjon | undefined,
    underenhetTilParent: Map<string, Organisasjon>
): Organisasjon | undefined => {
    if (org === undefined) return undefined;

    const parentOrg = underenhetTilParent.get(org.orgnr);
    if (parentOrg === undefined) return org;

    return hentØversteLedd(parentOrg, underenhetTilParent);
};
