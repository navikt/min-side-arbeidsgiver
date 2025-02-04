import { BodyShort, Checkbox } from '@navikt/ds-react';
import React from 'react';
import { Set } from 'immutable';
import { Organisasjon } from '../../../OrganisasjonerOgTilgangerContext';
import { amplitudeFilterKlikk } from '../Saksfilter';

export const HovedenhetCheckbox = ({
    hovedenhet,
    valgteOrgnr,
}: {
    hovedenhet: Organisasjon;
    valgteOrgnr: Set<string>;
}) => {
    const valgt = valgteOrgnr.has(hovedenhet.orgnr);

    return (
        <Checkbox
            aria-expanded={valgt}
            size="small"
            value={hovedenhet.orgnr}
            id={`${hovedenhet.orgnr}_Virksomhetsmeny_checkbox`}
            key={`${hovedenhet.orgnr}_Virksomhetsmeny_list_key`}
            style={{ display: 'flex', alignItems: 'center' }}
            description={`Org.nr. ${hovedenhet.orgnr}`}
            onClick={(e) => amplitudeFilterKlikk('organisasjon', 'hovedenhet', e.target)}
        >
            <BodyShort size="medium" as="span">
                {hovedenhet.navn}
            </BodyShort>
        </Checkbox>
    );
};
