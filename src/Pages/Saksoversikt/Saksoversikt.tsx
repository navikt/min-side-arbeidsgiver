import React, { ChangeEvent, FC, RefObject, useEffect, useRef, useState } from 'react';
import './Saksoversikt.css';
import { Heading, Label, Pagination, Select } from '@navikt/ds-react';
import { SaksListe } from './SaksListe';
import { Alerts } from '../Alerts';
import { Filter, State, useOversiktStateTransitions } from './useOversiktStateTransitions';
import { OmSaker } from './OmSaker';
import { amplitudeFilterKlikk, Saksfilter } from './Saksfilter/Saksfilter';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import * as Record from '../../utils/Record';
import { Query, Sak, SakSortering } from '../../api/graphql-types';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { Set } from 'immutable';
import amplitude from '../../utils/amplitude';
import { LagreFilter } from './LagreFilter';
import { FilterChips } from './FilterChips';
import { ServerError } from '@apollo/client/link/utils';
import { Spinner } from '../Banner';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestversjon';

export const SIDE_SIZE = 30;

type SakstypeOverordnetArray = Pick<Query, 'sakstyper'>;

const HENT_SAKSTYPER: TypedDocumentNode<SakstypeOverordnetArray> = gql`
    query Sakstyper {
        sakstyper {
            navn
        }
    }
`;

const useAlleSakstyper = () => {
    const { data } = useQuery(HENT_SAKSTYPER, {
        onError: (error) => {
            if ((error.networkError as ServerError)?.statusCode !== 401) {
                console.error('#MSA: hentSakstyper feilet', error);
            }
        },
    });
    return data?.sakstyper ?? [];
};

export const amplitudeChipClick = (kategori: string, filternavn: string) => {
    amplitude.logEvent('chip-click', {
        kategori: kategori,
        filternavn: filternavn,
    });
};

export const Saksoversikt = () => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjonsInfo
        ? Record.mapToArray(organisasjonsInfo, (orgnr, { organisasjon }) => organisasjon)
        : [];

    const { state, byttFilter, setValgtFilterId } = useOversiktStateTransitions(orgs);
    const [stuck, setStuck] = useState(false);
    const handleValgteVirksomheter = (valgte: Set<string>) => {
        byttFilter({ ...state.filter, virksomheter: valgte });
    };

    const alleSakstyper = useAlleSakstyper();

    const saksoversiktRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null); //Brukes til å legge skygge under paginering og filtre

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                navRef.current?.toggleAttribute('data-stuck', entry.intersectionRatio < 1);
                setStuck(entry.intersectionRatio < 1);
            },
            { threshold: [1] }
        );

        if (navRef.current) {
            observer.observe(navRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="saksoversikt__innhold">
            <Saksfilter
                filter={state.filter}
                sakstypeinfo={state.sakstyper}
                alleSakstyper={alleSakstyper}
                setFilter={byttFilter}
                oppgaveTilstandInfo={state.oppgaveTilstandInfo}
                valgteVirksomheter={state.filter.virksomheter}
                setValgteVirksomheter={handleValgteVirksomheter}
            />
            <div className="saksoversikt" ref={saksoversiktRef}>
                <AdvarselBannerTestversjon />
                <Alerts />
                <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                    Mine filtervalg
                </Heading>
                <div ref={navRef} className="saksoversikt_sticky_top">
                    <LagreFilter
                        state={state}
                        byttFilter={byttFilter}
                        setValgtFilterId={setValgtFilterId}
                    />
                    <FilterChips state={state} byttFilter={byttFilter} />
                    <div className="saksoversikt__saksliste-header">
                        <VelgSortering state={state} byttFilter={byttFilter} />
                        <Sidevelger state={state} byttFilter={byttFilter} skjulForMobil={true} />
                    </div>
                </div>
                <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                    Saker
                </Heading>
                <SaksListeBody state={state} stuck={stuck} saksoversiktRef={saksoversiktRef} />
                <HvaVisesHer />
            </div>
        </div>
    );
};

const HvaVisesHer = () => {
    const hjelpetekstButton = useRef<HTMLButtonElement>(null);
    return (
        <div className="saksoversikt__hjelpetekst">
            <OmSaker id="hjelptekst" ref={hjelpetekstButton} />
            <button
                className={'saksoversikt__knapp'}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    hjelpetekstButton.current?.focus();
                    hjelpetekstButton.current?.click();
                }}
            >
                {' '}
                Hva vises her?
            </button>
        </div>
    );
};

type VelgSorteringProps = {
    state: State;
    byttFilter: (filter: Filter) => void;
};

const VelgSortering: FC<VelgSorteringProps> = ({ state, byttFilter }) => {
    if (state.sider === undefined || state.sider === 0) {
        return null;
    }

    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const sortering = e.target.value as SakSortering
        byttFilter({ ...state.filter, sortering: sortering });
        amplitudeFilterKlikk('sortering', sortering, null);
    };

    return (
        <Select
            autoComplete="off"
            value={state.filter.sortering}
            className="saksoversikt__sortering"
            label={`${state.totaltAntallSaker} saker sortert på`}
            onChange={handleOnChange}
        >
            {sorteringsrekkefølge.map((key) => (
                <option key={key} value={key}>
                    {sorteringsnavn[key]}
                </option>
            ))}
        </Select>
    );
};

const useCurrentDate = (pollInterval: number) => {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    useEffect(() => {
        /* We are unsure if the `mounted`-check is really necessary. */
        let mounted = true;
        const timer = setInterval(() => {
            if (mounted) {
                setCurrentDate(new Date());
            }
        }, pollInterval);
        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [pollInterval]);
    return currentDate;
};

const sorteringsnavn: Record<SakSortering, string> = {
    OPPDATERT: 'Oppdatert',
    OPPRETTET: 'Opprettet',
    FRIST: 'Frist',
};

const sorteringsrekkefølge: SakSortering[] = [
    SakSortering.Frist,
    SakSortering.Oppdatert,
    SakSortering.Opprettet,
];

type SidevelgerProp = {
    state: State;
    byttFilter: (filter: Filter) => void;
    skjulForMobil: boolean;
};

const Sidevelger: FC<SidevelgerProp> = ({ state, byttFilter, skjulForMobil = false }) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [setWidth]);

    if (state.sider === undefined || state.sider < 2) {
        return null;
    }

    return (
        <Pagination
            count={state.sider}
            page={state.filter.side}
            className={`saksoversikt__paginering ${
                skjulForMobil ? 'saksoversikt__skjul-for-mobil' : ''
            }`}
            siblingCount={width < 920 ? 0 : 1}
            boundaryCount={width < 800 ? 0 : 1}
            onPageChange={(side) => {
                byttFilter({ ...state.filter, side });
            }}
        />
    );
};

type SaksListeBodyProps = {
    state: State;
    stuck: boolean;
    saksoversiktRef: RefObject<HTMLDivElement>;
};

const SaksListeBody: FC<SaksListeBodyProps> = ({ state, stuck, saksoversiktRef }) => {
    if (state.state === 'error') {
        return (
            <Label aria-live="polite" aria-atomic="true">
                Feil ved lasting av saker.
            </Label>
        );
    }

    if (state.state === 'loading') {
        return <Laster startTid={state.startTid} forrigeSaker={state.forrigeSaker ?? undefined} />;
    }

    const { totaltAntallSaker, saker } = state;

    if (totaltAntallSaker === 0) {
        return (
            <Label aria-live="polite" aria-atomic="true">
                Ingen treff.
            </Label>
        );
    }

    return <SaksListe saker={saker} stuck={stuck} saksoversiktRef={saksoversiktRef} />;
};

type LasterProps = {
    forrigeSaker?: Array<Sak>;
    startTid: Date;
};

const Laster: FC<LasterProps> = ({ forrigeSaker, startTid }) => {
    const nåtid = useCurrentDate(50);
    const lasteTid = nåtid.getTime() - startTid.getTime();

    if (lasteTid < 200 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker} />;
    } else if (lasteTid < 3000 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker} placeholder={true} />;
    } else {
        return <Spinner />;
    }
};
