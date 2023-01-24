import { BodyShort, Search } from '@navikt/ds-react';
import React, {useRef, useState} from 'react';
import { Filter } from '../Saksoversikt/useOversiktStateTransitions';
import './Saksfilter.css'

export type SøkeboksProps = {
    filter: Filter,
    byttFilter: (filter: Filter) => void;
}

export const Søkeboks = ({filter, byttFilter}: SøkeboksProps) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [tekstsoek, setTekstsoek] = useState(filter.tekstsoek)

    return <form
        ref={formRef}
        className="saksfilter_søk-sak"
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
        <BodyShort className="saksfilter_headers">Søk blant saker</BodyShort>
        <Search
            label="Søk blandt saker"
            size="medium"
            variant="secondary"
            value={tekstsoek}
            onChange={setTekstsoek}
            onClear={ () => {
                setTekstsoek('')
                byttFilter({...filter, tekstsoek: ''});
            }}
        />
    </form>
}

