import { BodyShort, Checkbox } from '@navikt/ds-react';
import React from 'react';
import { Set } from 'immutable';
import { Organisasjon } from '../../../../altinn/organisasjon';
import { amplitudeFilterKlikk } from '../Saksfilter';

type UnderenhetCheckboksProps = {
    valgteOrgnr: Set<string>;
    underenhet: Organisasjon;
};

export const UnderenhetCheckboks = ({ underenhet, valgteOrgnr }: UnderenhetCheckboksProps) => {
    return (
            <Checkbox
                value={underenhet.OrganizationNumber}
                size="small"
                id={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
                description={`Org.nr. ${underenhet.OrganizationNumber}`}
                onClick={(e) => amplitudeFilterKlikk('organisasjon', 'underenhet', e.target)}
            >
                <BodyShort size="small" as="span">
                    {' '}
                    {underenhet.Name}{' '}
                </BodyShort>
            </Checkbox>

    );
};
