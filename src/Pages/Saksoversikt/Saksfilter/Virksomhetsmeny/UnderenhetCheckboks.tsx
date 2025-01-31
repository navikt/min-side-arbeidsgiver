import { BodyShort, Checkbox } from '@navikt/ds-react';
import React from 'react';
import { amplitudeFilterKlikk } from '../Saksfilter';
import { Organisasjon } from '../../../OrganisasjonerOgTilgangerProvider';

export const UnderenhetCheckboks = ({ underenhet }: { underenhet: Organisasjon }) => {
    return (
        <Checkbox
            value={underenhet.orgnr}
            size="small"
            id={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
            description={`Org.nr. ${underenhet.orgnr}`}
            onClick={(e) => amplitudeFilterKlikk('organisasjon', 'underenhet', e.target)}
        >
            <BodyShort size="small" as="span">
                {' '}
                {underenhet.navn}{' '}
            </BodyShort>
        </Checkbox>
    );
};
