import React, { useContext, useEffect, useRef } from 'react';
import { Search} from '@navikt/ds-react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

export type Filter = {
    side: number,
    tekstsoek: string,
    virksomhetsnummer: string | undefined
}

export type FilterProps = {
    filter: Filter;
    onChange: (filter: Filter) => void;
}

export const equalFilter = (a:Filter, b:Filter):boolean =>
    a.side === b.side && a.tekstsoek === b.tekstsoek && a.virksomhetsnummer === b.virksomhetsnummer


export const Filter = ({filter, onChange}: FilterProps) => {
    const searchElem = useRef<HTMLInputElement>(null)

    useVirksomhetsnummer(virksomhetsnummer => {
        onChange({...filter, virksomhetsnummer})
    })

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

const useVirksomhetsnummer = (onVirksomhetsnummerChange: (virksomhetsnummer: string) => void) => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const virksomhetsnummer = valgtOrganisasjon?.organisasjon?.OrganizationNumber ?? null
    useEffect(() => {
        if (virksomhetsnummer !== null) {
            onVirksomhetsnummerChange(virksomhetsnummer)
        }
    }, [virksomhetsnummer])
}

