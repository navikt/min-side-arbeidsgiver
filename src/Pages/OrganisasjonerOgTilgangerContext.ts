import React, { useContext, useEffect, useMemo } from 'react';
import * as Record from '../utils/Record';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import Immutable, { Set } from 'immutable';
import { AltinnTilgangssøknad, useAltinnTilgangssøknader } from '../altinn/tilganger';
import { useUserInfo } from '../hooks/useUserInfo';
import { AlertContext } from './Alerts';
import amplitude from '../utils/amplitude';
import { Identify } from '@amplitude/analytics-browser';
import { alleOrganisasjonerFlatt, mapRecursive, mergeOrgTre } from '../utils/util';
import { findRecursive } from '@navikt/virksomhetsvelger';

export type orgnr = string;

export type Søknadsstatus =
    | { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' }
    | { tilgang: 'ikke søkt' };

export interface Organisasjon {
    orgnr: string;
    organisasjonsform: string;
    navn: string;
    underenheter: Organisasjon[];
}

export type OrganisasjonInfo = {
    øversteLedd: Organisasjon | undefined;
    parent: Organisasjon | undefined;
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, boolean>;
    syfotilgang: boolean;
    antallSykmeldte: number;
    reporteetilgang: boolean;
    refusjonstatustilgang: boolean;
    refusjonstatus: {
        KLAR_FOR_INNSENDING?: number;
    };
};
export type OrganisasjonerOgTilgangerContext = {
    organisasjonstre: Organisasjon[];
    organisasjonsInfo: Record<orgnr, OrganisasjonInfo>;
    organisasjonerFlatt: Organisasjon[];
    orgnrTilParentMap: Immutable.Map<string, string>;
    orgnrTilChildrenMap: Immutable.Map<string, string[]>;
    altinnTilgangssøknad: Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>>;
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

export const useBeregnAltinnTilgangssøknad = (
    organisasjonsInfo: Record<string, OrganisasjonInfo> | undefined
): Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>> | undefined => {
    const altinnTilgangssøknader = useAltinnTilgangssøknader();

    return useMemo(() => {
        if (organisasjonsInfo === undefined) {
            return undefined;
        }

        return Record.fromEntries(
            Object.values(organisasjonsInfo).map((org) => {
                return [
                    org.organisasjon.orgnr,
                    Record.map(
                        altinntjeneste,
                        (_: AltinntjenesteId, { tjenestekode, tjenesteversjon }) =>
                            sjekkTilgangssøknader(
                                org.organisasjon.orgnr,
                                tjenestekode,
                                tjenesteversjon,
                                altinnTilgangssøknader
                            )
                    ),
                ];
            })
        );
    }, [organisasjonsInfo, altinnTilgangssøknader]);
};

export const sjekkTilgangssøknader = (
    orgnr: orgnr,
    tjenestekode: string,
    tjenesteversjon: string,
    altinnTilgangssøknader: AltinnTilgangssøknad[]
): Søknadsstatus => {
    const søknader = altinnTilgangssøknader.filter(
        (s) =>
            s.orgnr === orgnr &&
            s.serviceCode === tjenestekode &&
            s.serviceEdition.toString() === tjenesteversjon
    );

    if (søknader.some((_) => _.status === 'Unopened')) {
        return { tilgang: 'søkt' };
    }

    const søknad = søknader.find((_) => _.status === 'Created');
    if (søknad) {
        return { tilgang: 'søknad opprettet', url: søknad.submitUrl };
    }

    if (søknader.some((_) => _.status === 'Accepted')) {
        return { tilgang: 'godkjent' };
    }
    return { tilgang: 'ikke søkt' };
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
          orgnrTilParentMap: Immutable.Map<string, string>;
          orgnrTilChildrenMap: Immutable.Map<string, string[]>;
          organisasjonerFlatt: Organisasjon[];
      } => {
    const { userInfo } = useUserInfo();
    const { setSystemAlert } = useContext(AlertContext);

    useEffect(() => {
        setSystemAlert('UserInfoAltinn', userInfo?.altinnError ?? false);
        setSystemAlert('UserInfoDigiSyfo', userInfo?.digisyfoError ?? false);

        if (userInfo !== undefined) {
            amplitude.identify(
                new Identify()
                    .set('syfotilgang', userInfo.digisyfoOrganisasjoner.length > 0)
                    .set('buildTimestamp', __BUILD_TIMESTAMP__)
            );
        }
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

        const altinnOrganisasjonerFlatt = alleOrganisasjonerFlatt(userInfo.organisasjoner);
        const digisyfoOrganisasjonerFlatt = alleOrganisasjonerFlatt(
            userInfo.digisyfoOrganisasjoner
        );
        const organisasjonerFlatt: Organisasjon[] = [
            ...altinnOrganisasjonerFlatt,
            ...digisyfoOrganisasjonerFlatt,
        ];

        const orgnrTilParent = Immutable.Map(
            organisasjonerFlatt.flatMap((org) => {
                const parent = organisasjonerFlatt.find((it) =>
                    it.underenheter.some((it) => it.orgnr === org.orgnr)
                );
                if (parent === undefined) {
                    return [];
                }
                return [[org.orgnr, parent]];
            })
        );

        const organisasjonsInfo = Record.fromEntries(
            organisasjonerFlatt.map((org) => {
                const refusjonstatus = userInfo.refusjoner.find(
                    ({ virksomhetsnummer }) => virksomhetsnummer === org.orgnr
                );

                const digisyfoOrganisasjon = findRecursive(
                    userInfo.digisyfoOrganisasjoner,
                    ({ orgnr }) => orgnr === org.orgnr
                );
                return [
                    org.orgnr,
                    {
                        øversteLedd: hentØversteLedd(org, orgnrTilParent),
                        parent: orgnrTilParent.get(org.orgnr),
                        organisasjon: org,
                        altinntilgang: Record.map(
                            userInfo.tilganger,
                            (_: AltinntjenesteId, orgnrMedTilgang: Set<orgnr>): boolean =>
                                orgnrMedTilgang.has(org.orgnr)
                        ),
                        syfotilgang: digisyfoOrganisasjon !== undefined,
                        antallSykmeldte: digisyfoOrganisasjon?.antallSykmeldte ?? 0,
                        reporteetilgang: altinnOrganisasjonerFlatt.some(
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
            orgnrTilParentMap: orgnrTilParent.mapEntries(([key, value]) => [key, value.orgnr]),
            orgnrTilChildrenMap: orgnrTilParent.reduce(
                (acc, parent, child) =>
                    acc.update(parent.orgnr, [], (value) => value.concat(child)),
                Immutable.Map<string, string[]>()
            ),
            organisasjonerFlatt,
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
                underenheter: org.underenheter,
            }))
        );

        return { organisasjonstre };
    }, [userInfo]);
};

export const hentØversteLedd = (
    org: Organisasjon | undefined,
    underenhetTilParent: Immutable.Map<string, Organisasjon>
): Organisasjon | undefined => {
    if (org === undefined) return undefined;

    const parentOrg = underenhetTilParent.get(org.orgnr);
    if (parentOrg === undefined) return org;

    return hentØversteLedd(parentOrg, underenhetTilParent);
};
