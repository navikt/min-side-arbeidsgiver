import React, { useContext, useEffect, useRef } from 'react';
import { SearchField } from '@navikt/ds-react';
import SearchFieldInput from '@navikt/ds-react/esm/form/search-field/SearchFieldInput';
import SearchFieldButton from '@navikt/ds-react/esm/form/search-field/SearchFieldButton';
import { Search } from '@navikt/ds-icons';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

export type Filter = {
    side: number,
    tekstsoek: string,
    virksomhetsnummer: string | null
}

export type FilterProps = {
    filter: Filter;
    onChange: (filter: Filter) => void;
}

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

    return <div className="saksoversikt__sokefelt">
        <form onSubmit={(e) => {
            e.preventDefault()
            const tekstsoek = searchElem?.current?.value ?? ''
            onChange({...filter, tekstsoek })
        }}>
            <SearchField label="Søk" hideLabel>
                <SearchFieldInput ref={searchElem} />
                <SearchFieldButton variant="primary" type="submit">
                    <Search height="1.5rem" width="1.5rem" className="saksoversikt__sokefelt-ikon"/>
                </SearchFieldButton>
            </SearchField>
        </form>
    </div>
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

