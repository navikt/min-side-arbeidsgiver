import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useMemo } from 'react';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, useAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import amplitude from '../utils/amplitude';
import { Organisasjon } from '../altinn/organisasjon';
import { AlertContext } from './Alerts';
import { byggOrganisasjonstre } from './ByggOrganisasjonstre';
import { useEffectfulAsyncFunction } from '../hooks/useValueFromEffect';
import { Map, Set } from 'immutable';
import { useUserInfo } from '../hooks/useUserInfo';
import { ManglerTilganger } from './ManglerTilganger/ManglerTilganger';
import { SpinnerMedBanner } from './Banner';
import { Identify } from '@amplitude/analytics-browser';

type orgnr = string;

export type Søknadsstatus =
    | { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' }
    | { tilgang: 'ikke søkt' };

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, boolean>;
    syfotilgang: boolean;
    antallSykmeldte: number;
    reporteetilgang: boolean;
    refusjonstatustilgang: boolean;
    refusjonstatus: {
        KLAR_FOR_INNSENDING?: number;
    };
    organisasjonstypeForØversteLedd?: string;
};

export type OrganisasjonEnhet = {
    hovedenhet: Organisasjon;
    underenheter: Organisasjon[];
};

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    altinnTilgangssøknad: undefined | Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>>;
    organisasjonstre: OrganisasjonEnhet[];
    childrenMap: Map<string, Set<string>>;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

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
                    org.OrganizationNumber,
                    Record.map(
                        altinntjeneste,
                        (_: AltinntjenesteId, { tjenestekode, tjenesteversjon }) =>
                            sjekkTilgangssøknader(
                                org.OrganizationNumber,
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

// @ts-ignore
const buildTimestamp = __BUILD_TIMESTAMP__;

const useBeregnOrganisasjoner = (): Record<orgnr, OrganisasjonInfo> | undefined => {
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
            return undefined;
        }

        const virksomheter = [
            ...userInfo.organisasjoner,
            ...userInfo.digisyfoOrganisasjoner.map(({ organisasjon }) => organisasjon),
        ];
        const orgnummerTilOrganisasjon = Record.fromEntries(
            (virksomheter ?? []).map((it) => [it.OrganizationNumber, it])
        );

        return Record.fromEntries(
            virksomheter.map((org) => {
                const refusjonstatus = userInfo.refusjoner.find(
                    ({ virksomhetsnummer }) => virksomhetsnummer === org.OrganizationNumber
                );

                const digisyfoOrganisasjon = userInfo.digisyfoOrganisasjoner.find(
                    ({ organisasjon }) => organisasjon.OrganizationNumber === org.OrganizationNumber
                );
                return [
                    org.OrganizationNumber,
                    {
                        organisasjon: org,
                        altinntilgang: Record.map(
                            userInfo.tilganger,
                            (_: AltinntjenesteId, orgnrMedTilgang: Set<orgnr>): boolean =>
                                orgnrMedTilgang.has(org.OrganizationNumber)
                        ),
                        syfotilgang: digisyfoOrganisasjon !== undefined,
                        antallSykmeldte: digisyfoOrganisasjon?.antallSykmeldte ?? 0,
                        reporteetilgang: userInfo.organisasjoner.some(
                            ({ OrganizationNumber }) =>
                                OrganizationNumber === org.OrganizationNumber
                        ),
                        refusjonstatus: refusjonstatus?.statusoversikt ?? {},
                        refusjonstatustilgang: refusjonstatus?.tilgang ?? false,
                        organisasjonstypeForØversteLedd: hentOrganisasjonsformFraØversteLedd(
                            org,
                            orgnummerTilOrganisasjon
                        ),
                    },
                ];
            })
        );
    }, [userInfo]);
};

const hentOrganisasjonsformFraØversteLedd = (
    org: Organisasjon | undefined,
    organisasjoner: Record<string, Organisasjon>
): string | undefined => {
    if (org === undefined) return undefined;

    const parentOrg = organisasjoner[org.ParentOrganizationNumber];
    if (parentOrg === undefined) return org.OrganizationForm;

    return hentOrganisasjonsformFraØversteLedd(parentOrg, organisasjoner);
};

const useOrganisasjonstre = (organisasjoner: Record<orgnr, OrganisasjonInfo> | undefined) => {
    const [organisasjonstreResponse, error] = useEffectfulAsyncFunction(
        undefined as OrganisasjonEnhet[] | undefined,
        byggOrganisasjonstre,
        [organisasjoner]
    );

    const organisasjonstre = error ? [] : organisasjonstreResponse;

    const childrenMap = useMemo(
        () =>
            Map(
                (organisasjonstre ?? []).map(
                    ({ hovedenhet, underenheter }): [string, Set<string>] => [
                        hovedenhet.OrganizationNumber,
                        Set(underenheter.map((it) => it.OrganizationNumber)),
                    ]
                )
            ),
        [organisasjonstre]
    );

    return { organisasjonstre, childrenMap };
};

export const OrganisasjonerOgTilgangerProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const organisasjoner = useBeregnOrganisasjoner();
    const altinnTilgangssøknad = useBeregnAltinnTilgangssøknad();

    const { organisasjonstre, childrenMap } = useOrganisasjonstre(organisasjoner);

    if (organisasjoner === undefined || organisasjonstre === undefined) {
        return <SpinnerMedBanner />;
    }

    const harTilganger = Record.values(organisasjoner).some(
        (org) => org.organisasjon.ParentOrganizationNumber
    );

    if (!harTilganger) {
        return <ManglerTilganger />;
    }

    return (
        <OrganisasjonerOgTilgangerContext.Provider
            value={{
                organisasjoner,
                organisasjonstre,
                childrenMap,
                altinnTilgangssøknad,
            }}
        >
            {props.children}
        </OrganisasjonerOgTilgangerContext.Provider>
    );
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
