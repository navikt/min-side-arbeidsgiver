import React, { useEffect, useRef } from 'react';
import { Search} from '@navikt/ds-react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';

export type Filter = {
    side: number,
    tekstsoek: string,
    virksomhetsnumre: string[] | undefined,
    sortering: GQL.SakSortering,
}

export type FilterProps = {
    filter: Filter;
    onChange: (filter: Filter) => void;
}

function equalVirksomhetsnumre(a: Filter, b: Filter) {
    if (a.virksomhetsnumre === undefined || b.virksomhetsnumre === undefined) {
        return a.virksomhetsnumre === b.virksomhetsnumre
    }

    return a.virksomhetsnumre.length === b.virksomhetsnumre.length &&
        a.virksomhetsnumre.every(virksomhetsnummer => b.virksomhetsnumre !== undefined && b.virksomhetsnumre.includes(virksomhetsnummer));
}

export const equalFilter = (a:Filter, b:Filter): boolean =>
    a.side === b.side &&
    a.tekstsoek === b.tekstsoek &&
    equalVirksomhetsnumre(a, b) &&
    a.sortering === b.sortering


export const Filter = ({filter, onChange}: FilterProps) => {
    const searchElem = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (searchElem.current) {
            searchElem.current.value = filter.tekstsoek
        }
    }, [searchElem.current, filter.tekstsoek])

    return <form onSubmit={(e) => {
            e.preventDefault()
            const tekstsoek = searchElem?.current?.value ?? ''
            onChange({...filter, tekstsoek})
        }}>
            <Search
                label="Søk"
                size="medium"
                variant="primary"
                ref={searchElem}
            />
        </form>

}

