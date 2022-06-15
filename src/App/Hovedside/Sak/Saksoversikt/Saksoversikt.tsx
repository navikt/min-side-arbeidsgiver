import React, {FC, useEffect, useRef, useState} from 'react';
import './Saksoversikt.less';
import Brodsmulesti from '../../../Brodsmulesti/Brodsmulesti';
import {BodyShort, HelpText, Pagination} from '@navikt/ds-react';
import {Spinner} from '../../../Spinner';
import {GQL} from '@navikt/arbeidsgiver-notifikasjon-widget';
import {useSaker} from '../useSaker';
import {SaksListe} from '../SaksListe';
import {Alerts} from '../../../Alerts/Alerts';
import amplitude from '../../../../utils/amplitude';
import {useOversiktStateTransitions} from './useOversiktStateTransitions';
import {State} from './useOversiktStateTransitions';
import {Filter} from './Filter';

export const SIDE_SIZE = 30;

const Saksoversikt = () => {
    const {state, byttFilter, lastingPågår, lastingFerdig, lastingFeilet} = useOversiktStateTransitions()
    const {loading, data} = useSaker(SIDE_SIZE, state.filter);

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

    const hjelpetekstButton = useRef<HTMLButtonElement>(null);


    return <div className='saksoversikt'>
        <Brodsmulesti brodsmuler={[{url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true}]}/>

        <div className="saksoversikt__header">
            <Filter filter={state.filter} onChange={byttFilter}/>

            <Pagination
                count={state.sider == undefined ? 0 : state.sider}
                page={state.filter.side}
                onPageChange={
                    side =>{
                        byttFilter({...state.filter, side})
                    }
                }
            />

        </div>
        <Alerts/>
        <FilterOgSøkResultat state={state}/>
        <div className="saksoversikt__hjelpetekst">
            <HelpText id="hjelptekst" ref={hjelpetekstButton} title="Hva vises her?">
                Her vises meldinger for permitteringer, oppsigelser <br/>eller innskrenkning i arbeidstid. Vi jobber med
                at <br/>flere saker skal vises her etterhvert.
            </HelpText>
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
}

const FilterOgSøkResultat: FC<FilterOgSøkResultat> = ({state}) => {
    if (state.state === 'error') {
        return <BodyShort>Feil ved lasting av saker.</BodyShort>
    }

    if (state.state === 'loading') {
        return <Laster startTid={state.startTid} forrigeSaker={state.forrigeSaker ?? undefined}/>
    }

    const {totaltAntallSaker, saker, filter} = state

    if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
        return <BodyShort>Ingen saker å vise på valgt virksomhet.</BodyShort>
    }

    if (totaltAntallSaker === 0) {
        return <BodyShort>Ingen treff.</BodyShort>
    }

    return <>
        <BodyShort> {totaltAntallSaker} treff </BodyShort>
        <SaksListe saker={saker}/>
    </>
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