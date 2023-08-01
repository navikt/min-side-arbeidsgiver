import React, { FC, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';
import './Saksoversikt.css';
import { Chips, Heading, Pagination, Select } from '@navikt/ds-react';
import { Spinner } from '../../../Spinner';
import { SaksListe } from '../SaksListe';
import { Alerts } from '../../../Alerts/Alerts';
import { Filter, State, useOversiktStateTransitions } from './useOversiktStateTransitions';
import { OmSaker } from '../OmSaker';
import { Saksfilter } from '../Saksfilter/Saksfilter';
import { OrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../../../utils/Record';
import { Query, Sak, SakSortering } from '../../../../api/graphql-types';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { Set } from 'immutable';
import { Organisasjon } from '../../../../altinn/organisasjon';
import { count } from '../../../../utils/util';
import { VirksomhetChips } from '../Saksfilter/VirksomhetChips';

export const SIDE_SIZE = 30;

type SakstypeOverordnetArray = Pick<Query, "sakstyper">

const HENT_SAKSTYPER: TypedDocumentNode<SakstypeOverordnetArray> = gql`
    query {
        sakstyper {
            navn
        }
    }
`

const useAlleSakstyper = () => {
    const {data} = useQuery(HENT_SAKSTYPER, {
        onError: (error) => {
            Sentry.captureException(error)
        },
    })
    return data?.sakstyper ?? []
}

export const Saksoversikt = () => {
    const {organisasjonstre, organisasjoner, childrenMap} = useContext(OrganisasjonerOgTilgangerContext);
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner ? Record.mapToArray(organisasjoner, (orgnr, {organisasjon}) => organisasjon) : [];

    const {state, byttFilter} = useOversiktStateTransitions(orgs)

    const handleValgteVirksomheter = (valgte: Set<string>) => {
        byttFilter({...state.filter, virksomheter: valgte})
    }

    const alleSakstyper = useAlleSakstyper()

    const onTømAlleFilter = () => {
        byttFilter({
            side: 1,
            tekstsoek: "",
            virksomheter: Set(),
            sortering: state.filter.sortering,
            sakstyper: [],
            oppgaveTilstand: [],
        })
    };

    const pills = useMemo(() => {
            const pills: (Organisasjon & {erHovedenhet: boolean})[] = []
            for (let {hovedenhet, underenheter} of organisasjonstre) {
                if (state.filter.virksomheter.has(hovedenhet.OrganizationNumber)) {
                    const antallUnderValgt = count(underenheter, it => state.filter.virksomheter.has(it.OrganizationNumber))
                    if (antallUnderValgt === 0) {
                        pills.push({...hovedenhet, erHovedenhet: true})
                    } else {
                        pills.push(...
                            underenheter.filter(it => state.filter.virksomheter.has(it.OrganizationNumber))
                                .map(it => ({...it, erHovedenhet: false}))
                        )
                    }
                }
            }
            return pills
        },
        [organisasjonstre, state.filter.virksomheter]
    )

    let pillElement: ReactNode;
    if (pills.length === 0) {
        pillElement = <></>
    } else {
        pillElement = <Chips>
            <Chips.Removable onClick={onTømAlleFilter}>Tøm alle filter</Chips.Removable>
                {pills.map((virksomhet) =>
                        <VirksomhetChips
                            key={virksomhet.OrganizationNumber}
                            navn={virksomhet.Name}
                            erHovedenhet={virksomhet.erHovedenhet}
                            onLukk={() => {
                                let valgte = state.filter.virksomheter.remove(virksomhet.OrganizationNumber);

                                // om virksomhet.OrganizatonNumber er siste underenhet, fjern hovedenhet også.
                                const parent = virksomhet.ParentOrganizationNumber
                                if (typeof parent === 'string') {
                                   const underenheter = childrenMap.get(parent) ?? Set()
                                   if (underenheter.every(it => !valgte.has(it))) {
                                       valgte = valgte.remove(parent)
                                   }
                                }
                                handleValgteVirksomheter(valgte)
                            }}
                        />
                )}
            </Chips>
    }



    return <div className="saksoversikt__innhold">
        <Saksfilter
            filter={state.filter}
            sakstypeinfo={state.sakstyper}
            alleSakstyper={alleSakstyper}
            setFilter={byttFilter}
            oppgaveTilstandInfo={state.oppgaveTilstandInfo}
            valgteVirksomheter={state.filter.virksomheter}
            setValgteVirksomheter={handleValgteVirksomheter}
        />
        <div className='saksoversikt'>
            <Alerts/>
            {pillElement}
            <div className="saksoversikt__header">
                <StatusLine state={state}/>
            </div>

            <div className="saksoversikt__saksliste-header">
                <VelgSortering state={state} byttFilter={byttFilter}/>
                <Sidevelger state={state} byttFilter={byttFilter} skjulForMobil={true}/>
            </div>

            <SaksListeBody state={state}/>

            <div className="saksoversikt__saksliste-footer">
                <HvaVisesHer/>
                <Sidevelger state={state} byttFilter={byttFilter} skjulForMobil={false}/>
            </div>
        </div>
    </div>
};

const HvaVisesHer = () => {
    const hjelpetekstButton = useRef<HTMLButtonElement>(null);
    return <div className="saksoversikt__hjelpetekst">
        <OmSaker id="hjelptekst" ref={hjelpetekstButton}/>
        <button
            className={"saksoversikt__knapp"}
            onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                hjelpetekstButton.current?.focus();
                hjelpetekstButton.current?.click();
            }}> Hva vises her?
        </button>
    </div>

}

type VelgSorteringProps = {
    state: State;
    byttFilter: (filter: Filter) => void;
}

const VelgSortering: FC<VelgSorteringProps> = ({state, byttFilter}) => {
    if (state.sider === undefined || state.sider === 0) {
        return null
    }

    return <Select
        value={state.filter.sortering}
        className="saksoversikt__sortering"
        label="Sorter på"
        onChange={(e) => {
            byttFilter({...state.filter, sortering: e.target.value as SakSortering})
        }}
    >
        {sorteringsrekkefølge.map(key => (
            <option key={key} value={key}>{sorteringsnavn[key]}</option>
        ))}
    </Select>;
}


const useCurrentDate = (pollInterval: number) => {
    const [currentDate, setCurrentDate] = useState(() => new Date())
    useEffect(() => {
        /* We are unsure if the `mounted`-check is really necessary. */
        let mounted = true
        const timer = setInterval(() => {
            if (mounted) {
                setCurrentDate(new Date())
            }
        }, pollInterval)
        return () => {
            mounted = false
            clearInterval(timer)
        }
    }, [pollInterval])
    return currentDate
}

const sorteringsnavn: Record<SakSortering, string> = {
    "OPPDATERT": "Oppdatert",
    "OPPRETTET": "Opprettet",
    "FRIST": "Frist",
}

const sorteringsrekkefølge: SakSortering[] = [
        SakSortering.Frist,
        SakSortering.Oppdatert,
        SakSortering.Opprettet,
]

type SidevelgerProp = {
    state: State;
    byttFilter: (filter: Filter) => void;
    skjulForMobil: boolean;
}

const Sidevelger: FC<SidevelgerProp> = ({state, byttFilter, skjulForMobil= false}) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", setSize);
        return () => window.removeEventListener("resize", setSize);
    }, [setWidth]);

    if (state.sider === undefined || state.sider < 2) {
        return null
    }

    return <Pagination
        count={state.sider}
        page={state.filter.side}
        className={`saksoversikt__paginering ${skjulForMobil?"saksoversikt__skjul-for-mobil":""}`}
        siblingCount={width < 920 ? 0 : 1}
        boundaryCount={width < 800 ? 0 : 1}
        onPageChange={
            side => {
                byttFilter({...state.filter, side})
            }
        }
    />
}

const StatusLine: FC<{ state: State }> = ({state}) => {
    const statusText = () => {
        if (state.state === 'error') {
            return "Feil ved lasting av saker."
        }

        const {totaltAntallSaker, filter} = state
        if (totaltAntallSaker === 0 && filter.tekstsoek.trim() !== "") {
            return `Ingen treff for «${filter.tekstsoek}».`
        }

        if (totaltAntallSaker === 0) {
            return "Ingen treff."
        }

        if (state.totaltAntallSaker !== undefined) {
            return `Viser ${totaltAntallSaker} saker`
        }
        return ""
    }
    return <Heading level="2" size="medium" aria-live="polite" aria-atomic="true">
        {statusText()}
    </Heading>
}


type SaksListeBodyProps = {
    state: State;
}

const SaksListeBody: FC<SaksListeBodyProps> = ({state}) => {
    if (state.state === 'error') {
        return null;
    }

    if (state.state === 'loading') {
        return <Laster startTid={state.startTid} forrigeSaker={state.forrigeSaker ?? undefined}/>;
    }

    const {totaltAntallSaker, saker, filter} = state


    if (totaltAntallSaker === 0) {
        return null;
    }

    return <SaksListe saker={saker}/>;
}

type LasterProps = {
    forrigeSaker?: Array<Sak>;
    startTid: Date;
}

const Laster: FC<LasterProps> = ({forrigeSaker, startTid}) => {
    const nåtid = useCurrentDate(50)
    const lasteTid = nåtid.getTime() - startTid.getTime()

    if (lasteTid < 200 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker}/>
    } else if (lasteTid < 3000 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker} placeholder={true}/>
    } else {
        return <Spinner/>
    }
}