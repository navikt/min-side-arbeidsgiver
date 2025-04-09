import React, { useRef, useState, KeyboardEvent, useEffect } from 'react';
import './NotifikasjonPanel.css';
import { Tag } from '@navikt/ds-react';
import {
    MutationNotifikasjonKlikketPaaArgs,
    Notifikasjon,
    NotifikasjonKlikketPaaResultat,
    Query,
} from '../../../api/graphql-types';
import { Set } from 'immutable';
import {
    BellFillIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ExpandIcon,
    XMarkIcon,
} from '@navikt/aksel-icons';
import clsx from 'clsx';
import { InternLenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { gql, TypedDocumentNode, useQuery, useMutation } from '@apollo/client';
import NotifikasjonListeElement from './NotifikasjonListeElement';
import { logAnalyticsEvent } from '../../../utils/analytics';

const NotifikasjonPanel = () => {
    const { loading, data, error } = useHentNotifikasjoner();
    const useNotifikasjonKlikketPaa = () => useMutation(NOTIFIKASJONER_KLIKKET_PAA);
    const [notifikasjonKlikketPaa] = useNotifikasjonKlikketPaa();

    useEffect(() => {
        if (data?.notifikasjoner?.notifikasjoner && data.notifikasjoner.notifikasjoner.length > 0) {
            const antall = data.notifikasjoner.notifikasjoner.length;
            const uleste = data.notifikasjoner.notifikasjoner.filter(
                ({ brukerKlikk }) => !brukerKlikk.klikketPaa
            ).length;

            logAnalyticsEvent('last-komponent', {
                tittel: 'notifikasjons-panel',
                'antall-notifikasjoner': antall,
                'antall-ulestenotifikasjoner': uleste,
                'antall-lestenotifikasjoner': antall - uleste,
            });
        }
    }, [data]);

    const [erUtvidet, setErUtvidet] = useState(false);

    useEffect(() => {
        if (erUtvidet) {
            logAnalyticsEvent('panel-ekspander', {
                tittel: 'arbeidsgiver notifikasjon panel',
                'antall-notifikasjoner': antallNotifikasjoner,
                'antall-ulestenotifikasjoner': antallUlesteNotifikasjoner,
                'antall-lestenotifikasjoner': antallNotifikasjoner - antallUlesteNotifikasjoner,
            });
        } else {
            logAnalyticsEvent('panel-kollaps', {
                tittel: 'arbeidsgiver notifikasjon panel',
            });
        }
    }, [erUtvidet]);

    const maksTags = 8;

    const toggleUtvidet = () => {
        const nyVerdi = !erUtvidet;
        setErUtvidet(nyVerdi);

        if (!nyVerdi) {
            setFocusedNotifikasjonIndex(-1);
            notifikasjonContainerRef.current?.focus();
        }
    };

    const [focusedNotifikasjonIndex, setFocusedNotifikasjonIndex] = useState(-1);

    const notifikasjonContainerRef = useRef<HTMLDivElement>(null);
    const søkLinkRef = useRef<HTMLAnchorElement>(null);
    // const skjulPanelRef = useRef<HTMLButtonElement>(null);

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
        logAnalyticsEvent('piltast-navigasjon', {});
        switch (e.key) {
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

    if (loading || !data || data.notifikasjoner.notifikasjoner.length === 0) return null;

    const sakstyper = Array(
        ...Set<string>(
            data.notifikasjoner.notifikasjoner.map(({ merkelapp }) =>
                merkelapp.includes('Inntektsmelding') ? 'Inntektsmelding' : merkelapp
            )
        )
    ).sort();

    const antallNotifikasjoner = data.notifikasjoner.notifikasjoner.length;
    const antallUlesteNotifikasjoner = data.notifikasjoner.notifikasjoner.filter(
        ({ brukerKlikk }) => !brukerKlikk.klikketPaa
    ).length;

    const harUleste = antallUlesteNotifikasjoner > 0;

    // const harUleste = false;

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
            aria-label={erUtvidet ? 'Skjul notifikasjonspanel' : 'Utvid notifikasjonspanel'}
        >
            <div
                className={clsx('notifikasjon-panel', {
                    'notifikasjon-panel--ingen-varsler': !harUleste,
                })}
                role="region"
            >
                <div className="notifikasjon-left">
                    <div className="notifikasjon-icon">
                        <BellFillIcon fontSize="2rem" color="#005B82" />
                        {harUleste && (
                            <span className="notifikasjon-badge">
                                {antallUlesteNotifikasjoner < 10
                                    ? antallUlesteNotifikasjoner
                                    : '9+'}
                            </span>
                        )}
                    </div>
                    <div className="notifikasjon-tekst">
                        <h2>Varsler på dine virksomheter</h2>
                        <p>
                            {!harUleste
                                ? 'Ingen nye varsler'
                                : `${antallUlesteNotifikasjoner} uleste varsler`}
                        </p>
                    </div>
                </div>

                <div className="notifikasjon-tags">
                    {sakstyper.slice(0, maksTags).map((sakstype) => (
                        <Tag
                            key={sakstype}
                            size="small"
                            variant={harUleste ? 'alt3-filled' : 'neutral'}
                            className={clsx({ 'notifikasjon-tag': harUleste })}
                        >
                            {sakstype}
                        </Tag>
                    ))}
                    {sakstyper.length > maksTags && (
                        <Tag
                            size="small"
                            variant={harUleste ? 'alt3-filled' : 'neutral'}
                            className={clsx({ 'notifikasjon-tag': harUleste })}
                        >
                            + {sakstyper.length - maksTags}
                        </Tag>
                    )}
                </div>

                <div className="notifikasjon-dropdown">
                    {erUtvidet ? (
                        <ChevronUpIcon color="white" fontSize="2rem" />
                    ) : (
                        <ChevronDownIcon color="white" fontSize="2rem" />
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
                        {/*
                         <Button
                            ref={skjulPanelRef}
                            variant="tertiary"
                            size="small"
                            aria-label="Skjul notifikasjonspanel"
                            onClick={toggleUtvidet}
                            icon={<XMarkIcon aria-hidden />}
                        />
                        */}
                    </div>

                    <div
                        className="notifikasjon-element-container"
                        role="list"
                        aria-label="Notifikasjonsliste"
                    >
                        {data.notifikasjoner.notifikasjoner.map(
                            (notifikasjon: Notifikasjon, index) => {
                                return (
                                    <NotifikasjonListeElement
                                        notifikasjon={notifikasjon}
                                        handleKlikk={() => {
                                            notifikasjonKlikketPaa({
                                                variables: { id: notifikasjon.id },
                                            });
                                            logAnalyticsEvent('notifikasjon-klikk', {
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
                            }
                        )}
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
