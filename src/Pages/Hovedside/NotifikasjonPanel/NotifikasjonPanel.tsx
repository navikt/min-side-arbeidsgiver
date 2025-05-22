import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import './NotifikasjonPanel.css';
import { Tag } from '@navikt/ds-react';
import {
    MutationNotifikasjonerSistLestArgs,
    MutationNotifikasjonKlikketPaaArgs,
    Notifikasjon,
    NotifikasjonerSistLestResultat,
    NotifikasjonKlikketPaaResultat,
    Query,
} from '../../../api/graphql-types';
import { BellFillIcon, ChevronDownIcon, ChevronUpIcon, ExpandIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import { InternLenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { gql, TypedDocumentNode, useMutation, useQuery } from '@apollo/client';
import NotifikasjonListeElement from './NotifikasjonListeElement';
import { logAnalyticsEvent } from '../../../utils/analytics';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { ServerError } from '@apollo/client/link/utils';
import { filtrerUlesteNotifikasjoner } from './filtrerUlesteNotifikasjoner';
import { useLocalStorage } from '../../../hooks/useStorage';

const NotifikasjonPanel = () => {
    const { loading, data, error, stopPolling } = useHentNotifikasjoner();
    const [notifikasjonKlikketPaa] = useMutation(NOTIFIKASJONER_KLIKKET_PAA);
    const erMobil = useBreakpoint();
    const notifikasjoner = data?.notifikasjoner?.notifikasjoner;

    useEffect(() => {
        if (error) {
            console.error('Error fetching notifications:', error);
            if ((error.networkError as ServerError)?.statusCode === 401) {
                console.log('stopper poll pga 401 unauthorized');
                stopPolling();
            }
        }
    }, [error]);

    const { sistLest, setSistLest, mutationNotifikasjonerSistLest } = useNotifikasjonerSistLest();

    const setRemoteSistLest = useCallback(() => {
        if (notifikasjoner && notifikasjoner.length > 0) {
            // naiv impl forutsetter sortering
            mutationNotifikasjonerSistLest({
                variables: { tidspunkt: notifikasjoner[0].sorteringTidspunkt },
            });
        }
    }, [notifikasjoner]);

    useEffect(() => {
        if (notifikasjoner && notifikasjoner.length > 0) {
            const antall = notifikasjoner.length;

            logAnalyticsEvent('last-komponent', {
                komponent: 'varselpanel',
                tittel: 'notifikasjons-panel',
                'antall-notifikasjoner': antall,
                'antall-ulestenotifikasjoner': antallUleste,
                'antall-lestenotifikasjoner': antall - (antallUleste ?? 0),
            });
        }
    }, [notifikasjoner]);

    const antallUleste =
        notifikasjoner && filtrerUlesteNotifikasjoner(sistLest, notifikasjoner).length;

    const [erUtvidet, setErUtvidet] = useState(false);

    useEffect(() => {
        if (erUtvidet) {
            logAnalyticsEvent('panel-ekspander', {
                komponent: 'varselpanel',
                tittel: 'arbeidsgiver notifikasjon panel',
                'antall-notifikasjoner': antallNotifikasjoner,
                'antall-ulestenotifikasjoner': antallUleste ?? 0,
                'antall-lestenotifikasjoner': antallNotifikasjoner - (antallUleste ?? 0),
            });
        } else {
            if (notifikasjoner && notifikasjoner.length > 0) {
                setSistLest(notifikasjoner[0].sorteringTidspunkt);
            }
            logAnalyticsEvent('panel-kollaps', {
                komponent: 'varselpanel',
                tittel: 'arbeidsgiver notifikasjon panel',
            });
        }
    }, [erUtvidet]);

    const maksTags = erMobil ? 3 : 8;

    const toggleUtvidet = () => {
        const nyVerdi = !erUtvidet;
        setErUtvidet(nyVerdi);
        setRemoteSistLest();

        if (!nyVerdi) {
            setFocusedNotifikasjonIndex(-1);
            notifikasjonContainerRef.current?.focus();
        }
    };

    const [focusedNotifikasjonIndex, setFocusedNotifikasjonIndex] = useState(-1);

    const notifikasjonContainerRef = useRef<HTMLDivElement>(null);
    const søkLinkRef = useRef<HTMLAnchorElement>(null);

    useOnClickOutside(notifikasjonContainerRef, () => {
        if (erUtvidet) {
            setErUtvidet(false);
            setFocusedNotifikasjonIndex(-1);
        }
    });

    const handleNotifikasjonContainerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleUtvidet();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            setErUtvidet(false);
        }
        if (e.key === 'ArrowDown' && erUtvidet) {
            e.preventDefault();
            søkLinkRef.current?.focus();
        }
    };

    const handleNotifkasjonKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
        const maksLengde = data?.notifikasjoner?.notifikasjoner?.length ?? 0;
        logAnalyticsEvent('piltast-navigasjon', {
            komponent: 'varselpanel',
        });
        switch (e.key) {
            case 'Enter':
                e.stopPropagation();
                return;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedNotifikasjonIndex((prev) => (prev < maksLengde - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (focusedNotifikasjonIndex === 0) {
                    søkLinkRef.current?.focus();
                    setFocusedNotifikasjonIndex(-1);
                } else {
                    setFocusedNotifikasjonIndex((prev) => (prev > 0 ? prev - 1 : prev));
                }
                break;
            case 'Escape':
                e.preventDefault();
                setErUtvidet(false);
                notifikasjonContainerRef.current?.focus();
                break;
            case 'Tab':
                e.preventDefault();
                notifikasjonContainerRef.current?.focus();
                break;
        }
    };

    const handleSøkKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedNotifikasjonIndex(0);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setErUtvidet(false);
            notifikasjonContainerRef.current?.focus();
        }
    };

    if (loading || !notifikasjoner || notifikasjoner.length === 0) return null;

    const notifikasjonMerkelapper = Array.from(
        new Set(
            notifikasjoner.map(({ merkelapp }) =>
                merkelapp.includes('Inntektsmelding') ? 'Inntektsmelding' : merkelapp
            )
        )
    ).sort();

    const antallNotifikasjoner = notifikasjoner.length;

    const harUleste = antallUleste !== undefined && antallUleste > 0;

    return (
        <div
            className={clsx('notifikasjon-container', {
                utvidet: erUtvidet,
            })}
            onClick={toggleUtvidet}
            onKeyDown={handleNotifikasjonContainerKeyDown}
            role="button"
            tabIndex={0}
            ref={notifikasjonContainerRef}
            aria-expanded={erUtvidet}
            aria-controls="notifikasjon-utvidet-innhold"
            aria-live="polite"
            aria-label={erUtvidet ? 'Varsler' : 'Skjuler varsler'}
        >
            <div
                className={clsx('notifikasjon-panel', {
                    'notifikasjon-panel--ingen-varsler': !harUleste,
                })}
                role="region"
            >
                <div className="notifikasjon-left">
                    <div className="notifikasjon-icon">
                        <BellFillIcon fontSize="2rem" color="#005B82" aria-hidden />
                        {harUleste && (
                            <span
                                className="notifikasjon-badge"
                                aria-hidden="true"
                                data-testid={'antallUleste'}
                            >
                                {antallUleste && antallUleste < 10 ? antallUleste : '9+'}
                            </span>
                        )}
                    </div>
                    <div className="notifikasjon-tekst">
                        <h2>Saker på dine virksomheter</h2>
                        <p>{harUleste && `${antallUleste} uleste varsler`}</p>
                    </div>
                </div>

                <div className="notifikasjon-tags">
                    {notifikasjonMerkelapper.slice(0, maksTags).map((sakstype) => (
                        <Tag
                            key={sakstype}
                            size="small"
                            variant={harUleste ? 'alt3-filled' : 'neutral'}
                            className={clsx({ 'notifikasjon-tag': harUleste })}
                            aria-hidden
                        >
                            {sakstype}
                        </Tag>
                    ))}
                    {notifikasjonMerkelapper.length > maksTags && (
                        <Tag
                            size="small"
                            variant={harUleste ? 'alt3-filled' : 'neutral'}
                            className={clsx({ 'notifikasjon-tag': harUleste })}
                            aria-hidden
                        >
                            + {notifikasjonMerkelapper.length - maksTags}
                        </Tag>
                    )}
                </div>

                <div className="notifikasjon-dropdown">
                    {erUtvidet ? (
                        <ChevronUpIcon
                            color={harUleste ? 'white' : 'black'}
                            fontSize="2rem"
                            aria-hidden
                        />
                    ) : (
                        <ChevronDownIcon
                            color={harUleste ? 'white' : 'black'}
                            fontSize="2rem"
                            aria-hidden
                        />
                    )}
                </div>
            </div>

            {erUtvidet && (
                <div className="notifikasjon-utvidet-innhold" role="region">
                    <div className="notifikasjon-panel-bar">
                        <InternLenkeMedLogging
                            loggLenketekst="Saksoversikten lenke i NotifikasjonPanel"
                            href="/saksoversikt"
                            ref={søkLinkRef}
                            onKeyDown={handleSøkKeyDown}
                        >
                            Søk og filtrer på alle saker <ExpandIcon aria-hidden />
                        </InternLenkeMedLogging>
                    </div>

                    <div
                        className="notifikasjon-element-container"
                        role="list"
                        aria-label="Varsler"
                    >
                        {notifikasjoner.map((notifikasjon: Notifikasjon, index) => {
                            return (
                                <NotifikasjonListeElement
                                    notifikasjon={notifikasjon}
                                    handleKlikk={() => {
                                        notifikasjonKlikketPaa({
                                            variables: { id: notifikasjon.id },
                                        });
                                        logAnalyticsEvent('notifikasjon-klikk', {
                                            komponent: 'varselpanel',
                                            index,
                                            merkelapp: notifikasjon.merkelapp,
                                            'klikket-paa-tidligere':
                                                notifikasjon.brukerKlikk.klikketPaa,
                                            destinasjon: notifikasjon.lenke,
                                        });
                                    }}
                                    onKeyDown={handleNotifkasjonKeyDown}
                                    isFocused={focusedNotifikasjonIndex === index}
                                    onFocus={() => setFocusedNotifikasjonIndex(index)}
                                    key={notifikasjon.id}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotifikasjonPanel;

const useHentNotifikasjoner = () => {
    const HENT_NOTIFIKASJONER: TypedDocumentNode<Pick<Query, 'notifikasjoner'>> = gql`
        query hentNotifikasjoner {
            notifikasjoner {
                feilAltinn
                feilDigiSyfo
                notifikasjoner {
                    __typename
                    ... on Beskjed {
                        brukerKlikk {
                            id
                            klikketPaa
                        }
                        virksomhet {
                            navn
                            virksomhetsnummer
                        }
                        lenke
                        tekst
                        merkelapp
                        opprettetTidspunkt
                        sorteringTidspunkt
                        id
                        sak {
                            tittel
                            tilleggsinformasjon
                        }
                    }
                    ... on Oppgave {
                        brukerKlikk {
                            id
                            klikketPaa
                        }
                        virksomhet {
                            navn
                            virksomhetsnummer
                        }
                        lenke
                        tekst
                        merkelapp
                        opprettetTidspunkt
                        sorteringTidspunkt
                        paaminnelseTidspunkt
                        utgaattTidspunkt
                        utfoertTidspunkt
                        tilstand
                        id
                        frist
                        sak {
                            tittel
                            tilleggsinformasjon
                        }
                    }
                    ... on Kalenderavtale {
                        brukerKlikk {
                            id
                            klikketPaa
                        }
                        virksomhet {
                            navn
                            virksomhetsnummer
                        }
                        lenke
                        tekst
                        merkelapp
                        opprettetTidspunkt
                        sorteringTidspunkt
                        startTidspunkt
                        sluttTidspunkt
                        lokasjon {
                            adresse
                            postnummer
                            poststed
                        }
                        digitalt
                        avtaletilstand
                        id
                        sak {
                            tittel
                            tilleggsinformasjon
                        }
                    }
                }
            }
        }
    `;
    return useQuery(HENT_NOTIFIKASJONER, {
        variables: {},
        pollInterval: 60_000,
    });
};

const NOTIFIKASJONER_KLIKKET_PAA: TypedDocumentNode<
    NotifikasjonKlikketPaaResultat,
    MutationNotifikasjonKlikketPaaArgs
> = gql`
    mutation NotifikasjonKlikketPaa($id: ID!) {
        notifikasjonKlikketPaa(id: $id) {
            ... on BrukerKlikk {
                id
                klikketPaa
            }
            ... on UgyldigId {
                feilmelding
            }
        }
    }
`;

const MUTATION_NOTIFIKASJONER_SIST_LEST: TypedDocumentNode<
    NotifikasjonerSistLestResultat,
    MutationNotifikasjonerSistLestArgs
> = gql`
    mutation notifikasjonerSistLest($tidspunkt: ISO8601DateTime!) {
        notifikasjonerSistLest(tidspunkt: $tidspunkt) {
            ... on NotifikasjonerSistLest {
                tidspunkt
            }
        }
    }
`;

const QUERY_NOTIFIKASJONER_SIST_LEST: TypedDocumentNode<Pick<Query, 'notifikasjonerSistLest'>> =
    gql`
        query notifikasjonerSistLest {
            notifikasjonerSistLest {
                ... on NotifikasjonerSistLest {
                    tidspunkt
                }
            }
        }
    `;

export const useNotifikasjonerSistLest = () => {
    const { loading, error, data } = useQuery(QUERY_NOTIFIKASJONER_SIST_LEST);
    const [sistLest, setSistLest] = useState<string | undefined>(undefined);
    const [localStorageSistLest, _, deleteLocalStorageSistLest] = useLocalStorage<
        string | undefined
    >('sist_lest', undefined);
    const [mutationNotifikasjonerSistLest] = useMutation(MUTATION_NOTIFIKASJONER_SIST_LEST);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (error) {
            console.error('Error fetching sist lest:', error);
            return;
        }
        if (data && data.notifikasjonerSistLest.tidspunkt !== null) {
            setSistLest(data.notifikasjonerSistLest.tidspunkt);
        }
        // Dersom sistLest er null, populerer den fra localstorage.
        else if (localStorageSistLest !== undefined) {
            mutationNotifikasjonerSistLest({
                variables: { tidspunkt: localStorageSistLest },
            });
            setSistLest(localStorageSistLest);
            deleteLocalStorageSistLest();
        }
    }, [loading]);

    return { sistLest, setSistLest, mutationNotifikasjonerSistLest };
};
