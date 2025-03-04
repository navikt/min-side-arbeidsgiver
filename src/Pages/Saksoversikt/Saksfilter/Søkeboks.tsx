import { Search } from '@navikt/ds-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './Saksfilter.css';
import { amplitudeFilterKlikk } from './Saksfilter';
import { useSaksoversiktContext } from '../SaksoversiktProvider';

export const Søkeboks = () => {
    const {
        saksoversiktState: { filter },
        transitions: { setFilter },
    } = useSaksoversiktContext();

    const formRef = useRef<HTMLFormElement>(null);
    const [tekstsoek, setTekstsoek] = useState(filter.tekstsoek);

    useEffect(() => {
        setTekstsoek(filter.tekstsoek);
    }, [filter.tekstsoek]);

    const handleOnSubmit = (e: FormEvent) => {
        e.preventDefault();
        setFilter({ ...filter, tekstsoek });
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
                    setFilter({ ...filter, tekstsoek: '' });
                }}
            />
        </form>
    );
};
