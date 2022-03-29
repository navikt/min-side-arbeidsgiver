import React, { FC, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
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
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';

const SIDE_SIZE = 30;

type UseFilterProps = {
    onChange: (filter: Filter) => void;
}

const FilterWidget = ({onChange}: UseFilterProps) => {
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

    return <div className="saksoversikt__sokefelt">
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
}

const initDesiredState: desiredState = {
    filter: {
        tekstsoek: "",
        virksomhetsnummer: null,
    },
    side: 1,
    innhold: { vis: 'laster' },
}

type innhold =
    | { vis: 'content', saker: Array<GQL.Sak>, totaltAntallSaker: number }
    | { vis: 'error' }
    | { vis: 'laster', forrigeSaker?: Array<GQL.Sak> }

type desiredState = {
    filter: Filter;
    side: number;
    sider?: number;
    innhold: innhold
}

type action =
    | { action: 'bytt-side', side: number }
    | { action: 'bytt-filter', filter: Filter }
    | { action: 'lasting-pågår' }
    | { action: 'lasting-ferdig', resultat: GQL.SakerResultat }
    | { action: 'lasting-feilet' }

const useOversiktReducer = () => {
    const reduce = (current: desiredState, action: action): desiredState => {
        switch (action.action) {
            case 'bytt-filter':
                return {
                    filter: action.filter,
                    side: 1,
                    sider: undefined,
                    innhold: { vis: 'laster' }
                }
            case 'bytt-side':
                return {
                    ...current,
                    side: action.side,
                    innhold: { vis: 'laster' }
                }
            case 'lasting-pågår':
                return {
                    ...current,
                    innhold: { vis: 'laster' }
                }
            case 'lasting-feilet':
                return {
                    ...current,
                    innhold: { vis: 'error' }
                }
            case 'lasting-ferdig':
                const { totaltAntallSaker, saker } = action.resultat
                const sider = Math.ceil(totaltAntallSaker / SIDE_SIZE)
                if (totaltAntallSaker > 0 && saker.length === 0) {
                    // på et eller annet vis er det saker (totaltAntallSaker > 0), men
                    // vi mottok ingen. Kan det være fordi vi er forbi siste side? Prøv
                    // å gå til siste side.
                    return {
                        ...current,
                        side: Math.max(1, sider - 1),
                        sider,
                        innhold: { vis: 'laster' }
                    }
                } else {
                    return {
                        ...current,
                        sider,
                        innhold: {
                            vis: 'content',
                            saker: action.resultat.saker,
                            totaltAntallSaker: action.resultat.totaltAntallSaker,
                        }
                    }
                }
        }
    }

    const [state, dispatch] = useReducer(reduce, initDesiredState)

    return {
        state,
        byttFilter: (filter: Filter) => dispatch({action: 'bytt-filter', filter}),
        byttSide: (side: number) => dispatch({action: 'bytt-side', side}),
        lastingPågår: () => dispatch({action: 'lasting-pågår'}),
        lastingFerdig: (resultat: GQL.SakerResultat) => dispatch({action: 'lasting-ferdig', resultat}),
        lastingFeilet: () => dispatch({action: 'lasting-feilet'}),
    }
}

const noFilterApplied = (filter: Filter) => filter.tekstsoek.trim() === ""

const useVirksomhetsnummer = (onVirksomhetsnummerChange: (virksomhetsnummer: string) => void) => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const virksomhetsnummer = valgtOrganisasjon?.organisasjon?.OrganizationNumber ?? null
    useEffect(() => {
        if (virksomhetsnummer !== null) {
            onVirksomhetsnummerChange(virksomhetsnummer)
        }
    }, [virksomhetsnummer])
}

type InnholdProps = { filter: Filter, innhold: innhold }

const Innhold: FC<InnholdProps> = ({filter, innhold}) => {
    if (innhold.vis === 'error') {
        return <BodyShort>Feil ved lasting av saker.</BodyShort>
    }

    if (innhold.vis === 'laster') {
        return <Spinner/>
        // const {lasteStart} = innhold
        // const currentTime = useCurrentTime(resolution: 100ms)
        // if (currentTime - lasteStart > 250ms) {
        //     return <Placeholder/>
        // } else {
        //     return <SaksListe saker={saker}/>
        // }
    }
    const {totaltAntallSaker, saker } = innhold

    if (totaltAntallSaker === 0 && noFilterApplied(filter)) {
        return <BodyShort>Ingen saker å vise på valgt virksomhet.</BodyShort>
    }

    if (totaltAntallSaker === 0) {
        return <BodyShort>Ingen treff.</BodyShort>
    }

    return <SaksListe saker={saker}/>
}

const Saksoversikt = () => {
    const {state, byttFilter, byttSide, lastingPågår, lastingFerdig, lastingFeilet } = useOversiktReducer()
    const {loading, data} = useSaker(SIDE_SIZE, state?.side, state.filter);

    useEffect(() => {
        if (loading) {
            lastingPågår()
        } else if (data?.saker?.__typename !== "SakerResultat") {
            lastingFeilet()
        } else {
            lastingFerdig(data.saker)
        }
    }, [loading, data])

    return <div className='saksoversikt'>
        <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

        <div className="saksoversikt__header">
            <FilterWidget onChange={byttFilter}/>

            <SideBytter
                side={state.side}
                antallSider={state.sider}
                onSideValgt={byttSide}
            />
        </div>

        <Innhold filter={state.filter} innhold={state.innhold}/>
    </div>
};

export default Saksoversikt;