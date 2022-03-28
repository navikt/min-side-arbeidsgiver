import React, { useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Saksoversikt.less';
import Brodsmulesti from '../../../Brodsmulesti/Brodsmulesti';
import SideBytter from './SideBytter/SideBytter';
import { Search } from '@navikt/ds-icons';
import { BodyShort, SearchField } from '@navikt/ds-react';
import SearchFieldButton from '@navikt/ds-react/esm/form/search-field/SearchFieldButton';
import SearchFieldInput from '@navikt/ds-react/esm/form/search-field/SearchFieldInput';
import { SaksListe } from '../SaksListe';
import { Filter, useSaker } from '../useSaker';
import { Spinner } from '../../../Spinner';

const SIDE_SIZE = 10;

type UseFilterProps = {
    onChange: (filter: Filter) => void;
}

const useFilter = ({onChange}: UseFilterProps) => {
    const [tekstsoek, setTekstsoek] = useState("")
    const [virksomhetsnummer, setVirksomhetsnummer] = useState<string | null>(null)
    const searchElem = useRef<HTMLInputElement>(null)

    useVirksomhetsnummer(setVirksomhetsnummer)

    useEffect(() => {
        onChange({
            tekstsoek,
            virksomhetsnummer
        })
    }, [tekstsoek, virksomhetsnummer])

    const html = <div className="saksoversikt__sokefelt">
        <form onSubmit={(e) => {
            e.preventDefault()
            setTekstsoek(searchElem?.current?.value ?? "")
        }}>
            <SearchField label='Søk' hideLabel>
                <SearchFieldInput ref={searchElem} />
                <SearchFieldButton variant="primary" type='submit'>
                    <Search height="1.5rem" width="1.5rem" className="saksoversikt__sokefelt-ikon"/>
                </SearchFieldButton>
            </SearchField>
        </form>
    </div>

    return {html}
}

const initDesiredState: desiredState = {
    filter: {
        tekstsoek: "",
        virksomhetsnummer: null,
    },
    side: 1,
}

/* If you add any fields here or in filter, you have to update `useMemo` below. */
type desiredState = {
    filter: Filter;
    side: number;
    sider?: number;
}

type action =
    | { action: 'bytt-side', side: number }
    | { action: 'bytt-filter', filter: Filter }
    | { action: 'saker-lastet', sider: number }

const useOversiktReducer = () => {
    const reduce = (current: desiredState, action: action): desiredState => {
        switch (action.action) {
            case 'bytt-filter':
                return {
                    filter: action.filter,
                    side: 1,
                    sider: undefined,
                }
            case 'bytt-side':
                return { ...current, side: action.side}
            case 'saker-lastet':
                return { ...current, sider: action.sider }
        }
    }

    const [state, dispatch] = useReducer(reduce, initDesiredState)

    const memoState = useMemo(
        () => {
            return state
        }, [state.filter.tekstsoek, state.filter.virksomhetsnummer, state.side, state.sider]
    )

    return {
        state: memoState,
        byttFilter: (filter: Filter) => dispatch({action: 'bytt-filter', filter}),
        byttSide: (side: number) => dispatch({action: 'bytt-side', side}),
        sakerLastet: (sider: number) => dispatch({action: 'saker-lastet', sider}),
    }
}

const noFilterApplied = (filter: Filter) => (filter.tekstsoek ?? "").trim() === ""

const useVirksomhetsnummer = (onVirksomhetsnummerChange: (virksomhetsnummer: string) => void) => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const virksomhetsnummer = valgtOrganisasjon?.organisasjon?.OrganizationNumber ?? null
    useEffect(() => {
        if (virksomhetsnummer !== null) {
            onVirksomhetsnummerChange(virksomhetsnummer)
        }
    }, [virksomhetsnummer])
}

const Saksoversikt = () => {
    const {state, byttFilter, byttSide, sakerLastet} = useOversiktReducer()
    const {html: filterElement} = useFilter({ onChange: byttFilter })
    const {loading, data} = useSaker(SIDE_SIZE, state?.side, state.filter);
    const [body, setBody] = useState<JSX.Element>(() => <Spinner />)


    useEffect(() => {
        if (loading) {
            setBody(<Spinner />)
            return
        }

        if (data === undefined) {
            setBody(<BodyShort>Feil ved lasting av saker.</BodyShort>)
            return
        }

        const {saker, totaltAntallSaker} = data.saker
        const antallSider = Math.ceil(totaltAntallSaker / SIDE_SIZE)
        sakerLastet(antallSider)

        if (totaltAntallSaker === 0 && noFilterApplied(state.filter)) {
            setBody(<BodyShort>Ingen saker å vise på valgt virksomhet.</BodyShort>)
            return
        }

        if (totaltAntallSaker === 0) {
            setBody(<BodyShort>Ingen treff.</BodyShort>)
            return
        }

        if (saker.length === 0) {
            // på et eller annet vis er det saker (totaltAntallSaker > 0), men
            // vi mottok ingen. Kan det være fordi vi er forbi siste side? Prøv
            // å gå til siste side.
            byttSide(Math.max(1, antallSider - 1))
            return
        }

        setBody(<SaksListe saker={saker}/>)
    }, [loading, data])

    return <div className='saksoversikt'>
        <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

        <div className="saksoversikt__header">
            {filterElement}

            <SideBytter
                side={state.side}
                antallSider={state.sider}
                onSideValgt={byttSide}
            />
        </div>

        {body}
    </div>
};

export default Saksoversikt;