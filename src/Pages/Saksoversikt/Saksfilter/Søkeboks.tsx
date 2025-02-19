import { Search } from '@navikt/ds-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Filter } from '../useOversiktStateTransitions';
import './Saksfilter.css';
import { amplitudeFilterKlikk } from './Saksfilter';

export type SøkeboksProps = {
    filter: Filter;
    byttFilter: (filter: Filter) => void;
};

export const Søkeboks = ({ filter, byttFilter }: SøkeboksProps) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [tekstsoek, setTekstsoek] = useState(filter.tekstsoek);

    useEffect(() => {
        setTekstsoek(filter.tekstsoek);
    }, [filter.tekstsoek]);

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        byttFilter({ ...filter, tekstsoek });
        amplitudeFilterKlikk('tekstsøk', 'tekstsøk', null);
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleOnSubmit}
            onBlur={(event) => {
                if (formRef.current === null || formRef.current.contains(event.relatedTarget)) {
                    return;
                }
                setTekstsoek(filter.tekstsoek);
            }}
        >
            <Search
                autoComplete="off"
                label="Søk i tittel"
                description="F.eks. fødselsdato, navn"
                hideLabel={false}
                size="medium"
                variant="primary"
                value={tekstsoek}
                onChange={setTekstsoek}
                onClear={() => {
                    setTekstsoek('');
                    byttFilter({ ...filter, tekstsoek: '' });
                }}
            />
        </form>
    );
};
