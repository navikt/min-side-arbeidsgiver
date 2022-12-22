import React, { FC, useEffect, useRef, useState } from 'react';
import './Saksoversikt.css';
import Brodsmulesti from '../../../Brodsmulesti/Brodsmulesti';
import { BodyShort, Pagination, Select } from '@navikt/ds-react';
import { Spinner } from '../../../Spinner';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { SaksListe } from '../SaksListe';
import { Alerts } from '../../../Alerts/Alerts';
import { State, useOversiktStateTransitions } from './useOversiktStateTransitions';
import { Filter } from './Filter';
import { OmSaker } from '../OmSaker';
import { gittMiljo } from '../../../../utils/environment';
import { useSidetittel } from '../../../OrganisasjonDetaljerProvider';

export const SIDE_SIZE = 30;

export const Saksoversikt = () => {
    const {state, byttFilter} = useOversiktStateTransitions()
    useSidetittel("Saksoversikt")

    return <div className='saksoversikt'>
        <Brodsmulesti brodsmuler={[{url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true}]}/>
        <Alerts/>
        <div className="saksoversikt__header">
            <Filter filter={state.filter} onChange={byttFilter}/>
            <VelgSortering state={state} byttFilter={byttFilter}/>
        </div>

        <div className="saksoversik__saksliste-header">
            <StatusLine state={state}/>
            <Sidevelger state={state} byttFilter={byttFilter}/>
        </div>

        <SaksListeBody state={state} />

        <div className="saksoversik__saksliste-footer">
            <HvaVisesHer />
            <Sidevelger state={state} byttFilter={byttFilter}/>
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

const VelgSortering: FC<VelgSorteringProps> = ({state, byttFilter}) =>
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

const StatusLine: FC<{state: State}> = ({state}) => {
    const statusText = () => {
        if (state.state === 'error') {
            return "Feil ved lasting av saker."
        }

        const {totaltAntallSaker, filter} = state
        if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
            return "Ingen saker å vise på valgt virksomhet."
        }

        if (totaltAntallSaker === 0) {
            return "Ingen treff."
        }

        if (state.totaltAntallSaker !== undefined) {
            return `${totaltAntallSaker} treff`
        }
        return ""
    }
    return <BodyShort role="status">
        {statusText()}
    </BodyShort>
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

    if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
        return null;
    }

    if (totaltAntallSaker === 0) {
        return null;
    }

    return <SaksListe saker={saker}/>;
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