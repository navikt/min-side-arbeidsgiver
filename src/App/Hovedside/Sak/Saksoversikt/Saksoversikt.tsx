import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import './Saksoversikt.css';
import {Heading, Pagination, Select} from '@navikt/ds-react';
import {Spinner} from '../../../Spinner';
import {GQL} from '@navikt/arbeidsgiver-notifikasjon-widget';
import {SaksListe} from '../SaksListe';
import {Alerts} from '../../../Alerts/Alerts';
import { Filter, useOversiktStateTransitions } from './useOversiktStateTransitions';
import {State} from './useOversiktStateTransitions';
import {OmSaker} from '../OmSaker';
import {gittMiljo} from '../../../../utils/environment';
import {Saksfilter} from "../Saksfilter/Saksfilter";
import {OrganisasjonerOgTilgangerContext} from "../../../OrganisasjonerOgTilgangerProvider";
import * as Record from "../../../../utils/Record";
import {Organisasjon} from "../Saksfilter/Virksomhetsmeny/Virksomhetsmeny";

export const SIDE_SIZE = 30;

export const Saksoversikt = () => {
    const {state, byttFilter} = useOversiktStateTransitions()

    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    const [searchParams] = useSearchParams()

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner ? Record.mapToArray(organisasjoner, (orgnr, {organisasjon}) => organisasjon) : [];
    const [valgteVirksomheter, setValgteVirksomheter] = useState<Organisasjon[] | "ALLEBEDRIFTER">();
    const bedriftUrlParam = searchParams.get('bedrift')

    const handleValgteVirksomheter = (valgte: Organisasjon[] | "ALLEBEDRIFTER") => {
        setValgteVirksomheter(valgte)
        byttFilter({...state.filter, virksomhetsnumre: (valgte === "ALLEBEDRIFTER" ? orgs : valgte).map(org => org.OrganizationNumber)})
    }

    if (valgteVirksomheter === undefined) {
        handleValgteVirksomheter(orgs.filter(org => bedriftUrlParam === org.OrganizationNumber))
        return null;
    }

    return <div className="saksoversikt__innhold">
        <Saksfilter
            filter={state.filter}
            setFilter={byttFilter}
            organisasjoner={orgs}
            valgteVirksomheter={valgteVirksomheter}
            setValgteVirksomheter={handleValgteVirksomheter}
        />
        {(state.filter.virksomhetsnumre?.length === 0)
            ? <div className='saksoversikt-empty'>
                <Heading level="2" size="large">
                    Velg virksomhet for å se saker
                </Heading>
            </div>
            : <div className='saksoversikt'>
                <Alerts/>
                <div className="saksoversikt__header">
                    <StatusLine state={state}/>
                </div>

                <div className="saksoversikt__saksliste-header">
                    <VelgSortering state={state} byttFilter={byttFilter}/>
                    <Sidevelger state={state} byttFilter={byttFilter}/>
                </div>

                <SaksListeBody state={state}/>

                <div className="saksoversikt__saksliste-footer">
                    <HvaVisesHer/>
                    <Sidevelger state={state} byttFilter={byttFilter}/>
                </div>
            </div>
        }
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
        value={state.filter.sortering}
        className="saksoversikt__sortering"
        label="Sorter på"
        onChange={(e) => {
            byttFilter({...state.filter, sortering: e.target.value as GQL.SakSortering})
        }}
    >
        {sorteringsrekkefølge.map(key => (
            <option key={key} value={key}>{sorteringsnavn[key]}</option>
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

    if (state.sider === undefined) {
        return null
    }

    return <Pagination
        count={state.sider}
        page={state.filter.side}
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
        if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
            return "Ingen saker å vise på valgt virksomhet."
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