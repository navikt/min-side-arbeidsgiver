import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, useAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import amplitude from '../utils/amplitude';
import { AlertContext } from './Alerts';
import Immutable, { Set } from 'immutable';
import { useUserInfo } from '../hooks/useUserInfo';
import { ManglerTilganger } from './ManglerTilganger/ManglerTilganger';
import { SpinnerMedBanner } from './Banner';
import { Identify } from '@amplitude/analytics-browser';
import { flatUtTre } from '../utils/util';
import { findRecursive } from '@navikt/virksomhetsvelger';
import {
    Organisasjon,
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
    orgnr,
    Søknadsstatus,
} from './OrganisasjonerOgTilgangerContext';

// @ts-ignore
const buildTimestamp = __BUILD_TIMESTAMP__;

const useBeregnAltinnTilgangssøknad = ():
    | Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>>
    | undefined => {
    const altinnTilgangssøknader = useAltinnTilgangssøknader();
    const { userInfo } = useUserInfo();

    return useMemo(() => {
        if (userInfo === undefined) {
            return undefined;
        }

        return Record.fromEntries(
            userInfo.organisasjoner.map((org) => {
                return [
                    org.orgnr,
                    Record.map(
                        altinntjeneste,
                        (_: AltinntjenesteId, { tjenestekode, tjenesteversjon }) =>
                            sjekkTilgangssøknader(
                                org.orgnr,
                                tjenestekode,
                                tjenesteversjon,
                                altinnTilgangssøknader
                            )
                    ),
                ];
            })
        );
    }, [userInfo, altinnTilgangssøknader]);
};

const sjekkTilgangssøknader = (
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

const useBeregnOrganisasjonsInfo = ():
    | {
          organisasjonsInfo: undefined;
          parentMap: undefined;
          childrenMap: undefined;
          organisasjonerFlatt: undefined;
      }
    | {
          organisasjonsInfo: Record<string, OrganisasjonInfo>;
          parentMap: Immutable.Map<string, string>;
          childrenMap: Immutable.Map<string, string[]>;
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
                    .set('buildTimestamp', buildTimestamp)
            );
        }
    }, [userInfo]);

    return useMemo(() => {
        if (userInfo === undefined) {
            return {
                organisasjonsInfo: undefined,
                parentMap: undefined,
                childrenMap: undefined,
                virksomheter: undefined,
            };
        }

        const organisasjonerFlatt: Organisasjon[] = [
            ...flatUtTre(userInfo.organisasjoner).flatMap((it) => [it, ...it.underenheter]),
            ...flatUtTre(userInfo.digisyfoOrganisasjoner).flatMap((it: Organisasjon) => [
                it,
                ...it.underenheter,
            ]),
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
                        reporteetilgang: organisasjonerFlatt.some(
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
            parentMap: orgnrTilParent.mapEntries(([key, value]) => [key, value.orgnr]),
            childrenMap: orgnrTilParent.reduce(
                (acc, parent, child) =>
                    acc.update(parent.orgnr, [], (value) => value.concat(child)),
                Immutable.Map<string, string[]>()
            ),
            organisasjonerFlatt,
        };
    }, [userInfo]);
};

const useBeregnOrganisasjonstre = (): { organisasjonstre: Organisasjon[] } => {
    const { userInfo } = useUserInfo();

    return useMemo(() => {
        if (userInfo === undefined) {
            return { organisasjonstre: [] };
        }

        // TODO: naive implementation, perhaps need to deep check for duplicates
        const organisasjonstre: Organisasjon[] = [...userInfo.organisasjoner];
        for (const digisyfoOrganisasjon of userInfo.digisyfoOrganisasjoner) {
            if (organisasjonstre.every(({ orgnr }) => orgnr !== digisyfoOrganisasjon.orgnr)) {
                organisasjonstre.push(digisyfoOrganisasjon);
            }
        }

        return { organisasjonstre };
    }, [userInfo]);
};

export const OrganisasjonerOgTilgangerProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const { organisasjonstre } = useBeregnOrganisasjonstre();
    const { organisasjonsInfo, organisasjonerFlatt, parentMap, childrenMap } =
        useBeregnOrganisasjonsInfo();
    const altinnTilgangssøknad = useBeregnAltinnTilgangssøknad();

    if (
        organisasjonsInfo === undefined ||
        organisasjonstre === undefined ||
        altinnTilgangssøknad === undefined
    ) {
        return <SpinnerMedBanner />;
    }

    const harTilganger = Record.values(organisasjonsInfo).some(
        (org) => org.organisasjon.underenheter.length > 0
    );

    if (!harTilganger) {
        return <ManglerTilganger />;
    }

    return (
        <OrganisasjonerOgTilgangerContext.Provider
            value={{
                organisasjonstre,
                organisasjonerFlatt,
                parentMap,
                childrenMap,
                organisasjonsInfo,
                altinnTilgangssøknad,
            }}
        >
            {props.children}
        </OrganisasjonerOgTilgangerContext.Provider>
    );
};

const hentØversteLedd = (
    org: Organisasjon | undefined,
    underenhetTilParent: Immutable.Map<string, Organisasjon>
): Organisasjon | undefined => {
    if (org === undefined) return undefined;

    const parentOrg = underenhetTilParent.get(org.orgnr);
    if (parentOrg === undefined) return org;

    return hentØversteLedd(parentOrg, underenhetTilParent);
};
