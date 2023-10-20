import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, useAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import { SpinnerMedBanner } from './Spinner';
import amplitude from '../utils/amplitude';
import { Organisasjon } from '../altinn/organisasjon';
import { AlertContext } from './Alerts/Alerts';
import { byggOrganisasjonstre } from './ByggOrganisasjonstre';
import { useEffectfulAsyncFunction } from './hooks/useValueFromEffect';
import { Map, Set } from 'immutable';
import { DigiSyfoOrganisasjon, RefusjonStatus, useUserInfo } from './useUserInfo';
import { ManglerTilganger } from './ManglerTilganger/ManglerTilganger';

type orgnr = string;

export type Søknadsstatus =
    | { tilgang: 'søknad opprettet'; url: string }
    | { tilgang: 'søkt' }
    | { tilgang: 'godkjent' }
    | { tilgang: 'ikke søkt' };

export type OrganisasjonInfo = {
    organisasjon: Organisasjon;
    altinntilgang: Record<AltinntjenesteId, boolean>;
    altinnsøknad: Record<AltinntjenesteId, Søknadsstatus>;
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
    organisasjonstre: OrganisasjonEnhet[];
    childrenMap: Map<string, Set<string>>;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

const beregnOrganisasjoner = (
    altinnorganisasjoner: Organisasjon[] | undefined,
    syfoVirksomheter: DigiSyfoOrganisasjon[] | undefined,
    altinntilganger: Record<AltinntjenesteId, Set<string>> | undefined,
    altinnTilgangssøknader: AltinnTilgangssøknad[] | undefined,
    alleRefusjonsstatus: RefusjonStatus[] | undefined
): Record<orgnr, OrganisasjonInfo> | undefined => {
    if (
        !(
            altinnorganisasjoner &&
            syfoVirksomheter &&
            altinntilganger &&
            altinnTilgangssøknader &&
            alleRefusjonsstatus !== undefined
        )
    ) {
        return undefined;
    }

    const virksomheter = [
        ...altinnorganisasjoner,
        ...syfoVirksomheter.map(({ organisasjon }) => organisasjon),
    ];

    return Record.fromEntries(
        virksomheter.map((org) => {
            const refusjonstatus = alleRefusjonsstatus.find(
                ({ virksomhetsnummer }) => virksomhetsnummer === org.OrganizationNumber
            );
            return [
                org.OrganizationNumber,
                {
                    organisasjon: org,
                    altinntilgang: Record.map(
                        altinntilganger,
                        (id: AltinntjenesteId, orgnrMedTilgang: Set<orgnr>): boolean =>
                            orgnrMedTilgang.has(org.OrganizationNumber)
                    ),
                    altinnsøknad: Record.map(
                        altinntilganger,
                        (id: AltinntjenesteId, _orgnrMedTilgang: Set<orgnr>) =>
                            sjekkTilgangssøknader(
                                org.OrganizationNumber,
                                id,
                                _orgnrMedTilgang,
                                altinnTilgangssøknader
                            )
                    ),
                    syfotilgang: syfoVirksomheter.some(
                        ({ organisasjon }) =>
                            organisasjon.OrganizationNumber === org.OrganizationNumber
                    ),
                    antallSykmeldte:
                        syfoVirksomheter.find(
                            ({ organisasjon }) =>
                                organisasjon.OrganizationNumber === org.OrganizationNumber
                        )?.antallSykmeldte ?? 0,
                    reporteetilgang: altinnorganisasjoner.some(
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
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<Organisasjon[] | undefined>(
        undefined
    );
    const [altinntilganger, setAltinntilganger] = useState<
        Record<AltinntjenesteId, Set<string>> | undefined
    >(undefined);

    const [syfoVirksomheter, setSyfoVirksomheter] = useState<DigiSyfoOrganisasjon[] | undefined>(
        undefined
    );
    const [alleRefusjonsstatus, setAlleRefusjonsstatus] = useState<RefusjonStatus[] | undefined>(
        undefined
    );
    const { setSystemAlert } = useContext(AlertContext);
    const altinnTilgangssøknader = useAltinnTilgangssøknader();
    const userInfo = useUserInfo();
    useEffect(() => {
        if (!userInfo.loaded) {
            // ikke set organisasjoner og tilganger før de er lastet
            return;
        }

        setSystemAlert('UserInfoAltinn', userInfo.altinnError);
        setSystemAlert('UserInfoDigiSyfo', userInfo.digisyfoError);
        setAltinnorganisasjoner(userInfo.organisasjoner);
        setAltinntilganger(userInfo.tilganger);
        setSyfoVirksomheter(userInfo.digisyfoOrganisasjoner);
        setAlleRefusjonsstatus(userInfo.refusjoner);
        amplitude.setUserProperties({ syfotilgang: userInfo.digisyfoOrganisasjoner.length > 0 });
    }, [JSON.stringify(userInfo)]);

    const beregnOrganisasjonerArgs = [
        altinnorganisasjoner,
        syfoVirksomheter,
        altinntilganger,
        altinnTilgangssøknader,
        alleRefusjonsstatus,
    ] as const;

    const organisasjoner = useMemo(
        () => beregnOrganisasjoner(...beregnOrganisasjonerArgs),
        beregnOrganisasjonerArgs
    );

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
    _orgnrMedTilgang: Set<orgnr>,
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
