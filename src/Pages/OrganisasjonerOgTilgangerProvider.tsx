import React, { FunctionComponent, useContext, useEffect, useMemo } from 'react';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, useAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import amplitude from '../utils/amplitude';
import { Organisasjon } from '../altinn/organisasjon';
import { AlertContext } from './Alerts';
import { byggOrganisasjonstre } from './ByggOrganisasjonstre';
import { useEffectfulAsyncFunction } from '../hooks/useValueFromEffect';
import { Map, Set } from 'immutable';
import { UserInfoRespons, useUserInfo } from './useUserInfo';
import { ManglerTilganger } from './ManglerTilganger/ManglerTilganger';
import { SpinnerMedBanner } from './Banner';

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

const beregnAltinnTilgangssøknad = (
    userInfo: UserInfoRespons | undefined,
    altinnTilgangssøknader: AltinnTilgangssøknad[] | undefined
): Record<orgnr, Record<AltinntjenesteId, Søknadsstatus>> | undefined => {
    if (userInfo === undefined || altinnTilgangssøknader === undefined) {
        return undefined;
    }

    return Record.fromEntries(
        userInfo.organisasjoner.map((org) => {
            return [
                org.OrganizationNumber,
                Record.map(userInfo.tilganger, (id: AltinntjenesteId) =>
                    sjekkTilgangssøknader(org.OrganizationNumber, id, altinnTilgangssøknader)
                ),
            ];
        })
    );
};

const beregnOrganisasjoner = (
    userInfo: UserInfoRespons | undefined
): Record<orgnr, OrganisasjonInfo> | undefined => {
    if (userInfo === undefined) {
        return undefined;
    }

    const virksomheter = [
        ...userInfo.organisasjoner,
        ...userInfo.digisyfoOrganisasjoner.map(({ organisasjon }) => organisasjon),
    ];

    return Record.fromEntries(
        virksomheter.map((org) => {
            const refusjonstatus = userInfo.refusjoner.find(
                ({ virksomhetsnummer }) => virksomhetsnummer === org.OrganizationNumber
            );
            return [
                org.OrganizationNumber,
                {
                    organisasjon: org,
                    altinntilgang: Record.map(
                        userInfo.tilganger,
                        (id: AltinntjenesteId, orgnrMedTilgang: Set<orgnr>): boolean =>
                            orgnrMedTilgang.has(org.OrganizationNumber)
                    ),
                    syfotilgang: userInfo.digisyfoOrganisasjoner.some(
                        ({ organisasjon }) =>
                            organisasjon.OrganizationNumber === org.OrganizationNumber
                    ),
                    antallSykmeldte:
                        userInfo.digisyfoOrganisasjoner.find(
                            ({ organisasjon }) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        )?.antallSykmeldte ?? 0,
                    reporteetilgang: userInfo.organisasjoner.some(
                        ({ OrganizationNumber }) => OrganizationNumber === org.OrganizationNumber
                    ),
                    refusjonstatus: refusjonstatus?.statusoversikt ?? {},
                    refusjonstatustilgang: refusjonstatus?.tilgang ?? false,
                },
            ];
        })
    );
};

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = (props) => {
    const { setSystemAlert } = useContext(AlertContext);
    const altinnTilgangssøknader = useAltinnTilgangssøknader();
    const { userInfo } = useUserInfo();
    useEffect(() => {
        setSystemAlert('UserInfoAltinn', userInfo?.altinnError ?? false);
        setSystemAlert('UserInfoDigiSyfo', userInfo?.digisyfoError ?? false);

        if (userInfo !== undefined) {
            amplitude.setUserProperties({
                syfotilgang: userInfo.digisyfoOrganisasjoner.length > 0,
            });
        }
    }, [userInfo]);

    const organisasjoner = useMemo(() => beregnOrganisasjoner(userInfo), [userInfo]);

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

    const altinnTilgangssøknad = useMemo(
        () => beregnAltinnTilgangssøknad(userInfo, altinnTilgangssøknader),
        [userInfo, altinnTilgangssøknader]
    );

    if (organisasjoner === undefined || organisasjonstre === undefined) {
        return <SpinnerMedBanner />;
    }

    const harTilganger = Record.values(organisasjoner).some(
        (org) => org.organisasjon.ParentOrganizationNumber
    );

    if (!harTilganger) {
        return <ManglerTilganger />;
    }

    const context: Context = {
        organisasjoner,
        organisasjonstre,
        childrenMap,
        altinnTilgangssøknad,
    };
    return (
        <OrganisasjonerOgTilgangerContext.Provider value={context}>
            {props.children}
        </OrganisasjonerOgTilgangerContext.Provider>
    );
};

const sjekkTilgangssøknader = (
    orgnr: orgnr,
    id: AltinntjenesteId,
    altinnTilgangssøknader: AltinnTilgangssøknad[]
): Søknadsstatus => {
    const { tjenestekode, tjenesteversjon } = altinntjeneste[id];
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
