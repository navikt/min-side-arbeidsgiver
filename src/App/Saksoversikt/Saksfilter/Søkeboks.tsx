import { Search } from '@navikt/ds-react';
import React, { useEffect, useRef, useState } from 'react';
import { Filter } from '../useOversiktStateTransitions';
import './Saksfilter.css'

export type SøkeboksProps = {
    filter: Filter,
    byttFilter: (filter: Filter) => void;
}

export const Søkeboks = ({filter, byttFilter}: SøkeboksProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [tekstsoek, setTekstsoek] = useState(filter.tekstsoek)

    useEffect(() => {
        setTekstsoek(filter.tekstsoek)
    },[filter.tekstsoek])

    return <form
        ref={formRef}
        onSubmit={(e) => {
            e.preventDefault()
            byttFilter({...filter, tekstsoek })
        }}
        onBlur={(event) => {
            if (formRef.current=== null || formRef.current.contains(event.relatedTarget)) {
                return;
            }
            setTekstsoek(filter.tekstsoek)
        }}
    >
        <Search
            label="Søk i tittel"
            description="F.eks. fødselsdato, navn"
            hideLabel={false}
            size="medium"
            variant="primary"
            value={tekstsoek}
            onChange={setTekstsoek}
            onClear={ () => {
                setTekstsoek('')
                byttFilter({...filter, tekstsoek: ''});
            }}
        />
    </form>
}

