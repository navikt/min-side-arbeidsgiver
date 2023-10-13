import React, { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';
import { hentRefusjonstatus, RefusjonStatus } from '../api/dnaApi';
import * as Record from '../utils/Record';
import { AltinnTilgangssøknad, hentAltinnTilgangssøknader } from '../altinn/tilganger';
import { altinntjeneste, AltinntjenesteId } from '../altinn/tjenester';
import { SpinnerMedBanner } from './Spinner';
import amplitude from '../utils/amplitude';
import { Organisasjon } from '../altinn/organisasjon';
import { AlertContext } from './Alerts/Alerts';
import * as Sentry from '@sentry/browser';
import { byggOrganisasjonstre } from './ByggOrganisasjonstre';
import { useEffectfulAsyncFunction } from './hooks/useValueFromEffect';
import { Map, Set } from 'immutable';
import { DigiSyfoOrganisasjon, useUserInfo } from './useUserInfo';

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

export enum SyfoTilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

export type OrganisasjonEnhet = {
    hovedenhet: Organisasjon;
    underenheter: Organisasjon[];
};

export type Context = {
    organisasjoner: Record<orgnr, OrganisasjonInfo>;
    organisasjonstre: OrganisasjonEnhet[];
    visFeilmelding: boolean;
    tilgangTilSyfo: SyfoTilgang;
    visSyfoFeilmelding: boolean;
    harTilganger: boolean;
    childrenMap: Map<string, Set<string>>;
};

export const OrganisasjonerOgTilgangerContext = React.createContext<Context>({} as Context);

const beregnOrganisasjoner = (
    altinnorganisasjoner: Organisasjon[] | undefined,
    syfoVirksomheter: DigiSyfoOrganisasjon[] | undefined,
    altinntilganger: Record<AltinntjenesteId, Set<string>> | undefined,
    altinnTilgangssøknader: AltinnTilgangssøknad[] | undefined,
    tilgangTilSyfo: SyfoTilgang,
    alleRefusjonsstatus: RefusjonStatus[] | undefined
): Record<orgnr, OrganisasjonInfo> | undefined => {
    if (
        !(
            altinnorganisasjoner &&
            syfoVirksomheter &&
            altinntilganger &&
            altinnTilgangssøknader &&
            tilgangTilSyfo !== SyfoTilgang.LASTER &&
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
const measureAll = (done: (duration: number) => void, ...args: Promise<any>[]) => {
    const started = performance.now();
    Promise.all(args).finally(() => {
        done(performance.now() - started);
    });
};

export const OrganisasjonerOgTilgangerProvider: FunctionComponent = (props) => {
    const [altinnorganisasjoner, setAltinnorganisasjoner] = useState<Organisasjon[] | undefined>(
        undefined
    );
    const [altinntilganger, setAltinntilganger] = useState<
        Record<AltinntjenesteId, Set<string>> | undefined
    >(undefined);
    const [altinnTilgangssøknader, setAltinnTilgangssøknader] = useState<
        AltinnTilgangssøknad[] | undefined
    >([]);

    const [syfoVirksomheter, setSyfoVirksomheter] = useState<DigiSyfoOrganisasjon[] | undefined>(
        undefined
    );
    const [tilgangTilSyfo, setTilgangTilSyfo] = useState(SyfoTilgang.LASTER);
    const [visSyfoFeilmelding, setVisSyfoFeilmelding] = useState(false);
    const [visFeilmelding, setVisFeilmelding] = useState(false);
    const [alleRefusjonsstatus, setAlleRefusjonsstatus] = useState<RefusjonStatus[] | undefined>(
        undefined
    );
    const { addAlert } = useContext(AlertContext);
    useEffect(() => {
        measureAll(
            (tidMs) => {
                amplitude.logEvent('komponent-lastet', {
                    komponent: 'OrganisasjonerOgTilgangerProvider',
                    tidMs,
                });
            },
            hentAltinnTilgangssøknader()
                .then(setAltinnTilgangssøknader)
                .catch((error) => {
                    Sentry.captureException(error);
                    setAltinnTilgangssøknader([]);
                }),
            hentRefusjonstatus()
                .then((refusjonstatus) => {
                    setAlleRefusjonsstatus(refusjonstatus);
                })
                .catch((error) => {
                    Sentry.captureException(error);
                    setAlleRefusjonsstatus([]);
                    // har ikke egen alert type på dette, da det mest sannsynlig er altinn som feiler
                    setVisFeilmelding(true);
                    addAlert('TilgangerAltinn');
                })
        );
    }, []);
    const userInfo = useUserInfo();
    useEffect(() => {
        if (!userInfo.loaded) {
            // ikke set organisasjoner og tilganger før de er lastet
            return;
        }
        if (userInfo.altinnError) {
            addAlert('TilgangerAltinn');
            setVisFeilmelding(true);
        }
        if (userInfo.digisyfoError) {
            addAlert('TilgangerDigiSyfo');
            setVisSyfoFeilmelding(true);
        }
        setAltinnorganisasjoner(userInfo.organisasjoner);
        setAltinntilganger(userInfo.tilganger);
        setSyfoVirksomheter(userInfo.digisyfoOrganisasjoner);
        setTilgangTilSyfo(
            userInfo.digisyfoOrganisasjoner.length > 0
                ? SyfoTilgang.TILGANG
                : SyfoTilgang.IKKE_TILGANG
        );
        amplitude.setUserProperties({ syfotilgang: userInfo.digisyfoOrganisasjoner.length > 0 });
    }, [JSON.stringify(userInfo)]);

    const beregnOrganisasjonerArgs = [
        altinnorganisasjoner,
        syfoVirksomheter,
        altinntilganger,
        altinnTilgangssøknader,
        tilgangTilSyfo,
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

    if (organisasjoner !== undefined && organisasjonstre !== undefined) {
        const detFinnesEnUnderenhetMedParent = () => {
            return Record.values(organisasjoner).some(
                (org) => org.organisasjon.ParentOrganizationNumber
            );
        };

        const harTilganger = detFinnesEnUnderenhetMedParent() && Record.length(organisasjoner) > 0;

        const context: Context = {
            organisasjoner,
            organisasjonstre,
            visFeilmelding,
            visSyfoFeilmelding,
            tilgangTilSyfo,
            harTilganger,
            childrenMap,
        };
        return (
            <OrganisasjonerOgTilgangerContext.Provider value={context}>
                {props.children}
            </OrganisasjonerOgTilgangerContext.Provider>
        );
    } else {
        return <SpinnerMedBanner />;
    }
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
