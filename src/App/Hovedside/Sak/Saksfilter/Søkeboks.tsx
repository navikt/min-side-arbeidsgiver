import { BodyShort, Search } from '@navikt/ds-react';
import React, {useState} from 'react';
import { Filter } from '../Saksoversikt/useOversiktStateTransitions';
import './Saksfilter.css'

export type SøkeboksProps = {
    filter: Filter,
    byttFilter: (filter: Filter) => void;
}

export const Søkeboks = ({filter, byttFilter}: SøkeboksProps) => {
    const [tekstsoek, setTekstsoek] = useState(filter.tekstsoek)

    return <form
        className="saksfilter_søk-sak"
        onSubmit={(e) => {
            e.preventDefault()
            byttFilter({...filter, tekstsoek })
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

