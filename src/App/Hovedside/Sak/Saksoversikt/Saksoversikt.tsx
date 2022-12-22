import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import './Saksoversikt.css';
import Brodsmulesti from '../../../Brodsmulesti/Brodsmulesti';
import { BodyShort, Pagination, Select } from '@navikt/ds-react';
import { Spinner } from '../../../Spinner';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useSaker } from '../useSaker';
import { SaksListe } from '../SaksListe';
import { Alerts } from '../../../Alerts/Alerts';
import amplitude from '../../../../utils/amplitude';
import { State, useOversiktStateTransitions } from './useOversiktStateTransitions';
import { Filter } from './Filter';
import { OmSaker } from '../OmSaker';
import { gittMiljo } from '../../../../utils/environment';
import { useSidetittel } from '../../../OrganisasjonDetaljerProvider';

export const SIDE_SIZE = 30;

const Saksoversikt = () => {
    const {state, byttFilter, lastingPågår, lastingFerdig, lastingFeilet} = useOversiktStateTransitions()
    const {loading, data} = useSaker(SIDE_SIZE, state.filter);
    useSidetittel("Saksoversikt")

    useEffect(() => {
        if (loading) {
            lastingPågår()
        } else if (data?.saker?.__typename !== "SakerResultat") {
            lastingFeilet()
        } else {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'saksoversikt',
                side: state.filter.side,
                tekstsoek: state.filter.tekstsoek.trim() !== '',
                totaltAntallSaker: data.saker.totaltAntallSaker
            })
            lastingFerdig(data.saker)
        }
    }, [loading, data])


    return <div className='saksoversikt'>
        <Brodsmulesti brodsmuler={[{url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true}]}/>
        <Alerts/>
        <div className="saksoversikt__header">
            <Filter filter={state.filter} onChange={byttFilter}/>
            <Select
                className="saksoversikt__sortering"
                label="Sorter på"
                onChange={(e) => {
                    byttFilter({...state.filter, sortering: e.target.value as GQL.SakSortering})
                }}
                defaultValue={GQL.SakSortering.Oppdatert}
            >
                {sorteringsrekkefølge.map(key => (
                    <option value={key} key={key}>
                        {sorteringsnavn[key]}
                    </option>
                ))}
            </Select>
        </div>
        <Søkeresultat byttFilter={byttFilter} state={state}/>
    </div>
};


const noFilterApplied = (filter: Filter) => filter.tekstsoek.trim() === ""

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


interface FilterOgSøkResultat {
    state: State;
    byttFilter: (filter: Filter) => void;
}

const sorteringsnavn: Record<GQL.SakSortering, string> = {
    "OPPDATERT": "Oppdatert",
    "OPPRETTET": "Opprettet",
    "FRIST": "Frist",
}
const sorteringsrekkefølge: GQL.SakSortering[] = gittMiljo({
    prod: [
        GQL.SakSortering.Oppdatert,
        GQL.SakSortering.Opprettet,
    ],
    other: [
        GQL.SakSortering.Oppdatert,
        GQL.SakSortering.Frist,
        GQL.SakSortering.Opprettet,
    ],
})

type SidevelgerProp = {
    state: State;
    byttFilter: (filter: Filter) => void;
}

const Sidevelger: FC<SidevelgerProp> = ({state, byttFilter}) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", setSize);
        return () => window.removeEventListener("resize", setSize);
    }, [setWidth]);
    if (state.sider == undefined) {
        return null
    }
    return <Pagination
        count={state.sider}
        page={state.filter.side}
        siblingCount={width < 560 ? 0 : 1}
        boundaryCount={width < 440 ? 0 : 1}
        onPageChange={
            side => {
                byttFilter({...state.filter, side})
            }
        }
    />
}

type ResultatOppsummeringProp = {
    state: State;
    byttFilter: (filter: Filter) => void;
    children: ReactElement;
}

const ResultatOppsummering: FC<ResultatOppsummeringProp> = ({state, byttFilter, children}) => {
    const hjelpetekstButton = useRef<HTMLButtonElement>(null);

    return <>
        <div className="saksoversik__saksliste-header">
            {state.totaltAntallSaker !== undefined
                ? <BodyShort role="status"> {state.totaltAntallSaker} treff</BodyShort>
                : null}
            <Sidevelger state={state} byttFilter={byttFilter}/>
        </div>

        {children}
        <div className="saksoversik__saksliste-footer">
            <div className="saksoversikt__hjelpetekst">
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
            <Sidevelger state={state} byttFilter={byttFilter}/>
        </div>
    </>
}

const Søkeresultat: FC<FilterOgSøkResultat> = ({state, byttFilter}) => {
    if (state.state === 'error') {
        return <BodyShort>Feil ved lasting av saker.</BodyShort>
    }

    if (state.state === 'loading') {
        return <ResultatOppsummering state={state} byttFilter={byttFilter}>
            <Laster startTid={state.startTid} forrigeSaker={state.forrigeSaker ?? undefined}/>
        </ResultatOppsummering>
    }

    const {totaltAntallSaker, saker, filter} = state

    if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
        return <BodyShort>Ingen saker å vise på valgt virksomhet.</BodyShort>
    }

    if (totaltAntallSaker === 0) {
        return <BodyShort>Ingen treff.</BodyShort>
    }

    return <ResultatOppsummering state={state} byttFilter={byttFilter}>
        <SaksListe saker={saker}/>
    </ResultatOppsummering>
}

type LasterProps = {
    forrigeSaker?: Array<GQL.Sak>;
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

export default Saksoversikt;