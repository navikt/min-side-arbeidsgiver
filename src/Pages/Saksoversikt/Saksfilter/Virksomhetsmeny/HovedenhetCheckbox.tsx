import { BodyShort, Checkbox } from '@navikt/ds-react';
import React from 'react';
import './HovedenhetCheckbox.css';
import { Set } from 'immutable';
import { Organisasjon } from '../../../../altinn/organisasjon';
import { amplitudeFilterKlikk } from '../Saksfilter';

type HovedenhetCheckboxProp = {
    hovedenhet: Organisasjon;
    valgteOrgnr: Set<string>;
};

export const HovedenhetCheckbox = ({ hovedenhet, valgteOrgnr }: HovedenhetCheckboxProp) => {
    const valgt = valgteOrgnr.has(hovedenhet.OrganizationNumber);

    return (
        <div role="button" aria-expanded={valgt}>
            <div className="hovedenhet">
                <Checkbox
                    size="small"
                    value={hovedenhet.OrganizationNumber}
                    id={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                    key={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_list_key`}
                    style={{ display: 'flex', alignItems: 'center' }}
                    description={`Org.nr. ${hovedenhet.OrganizationNumber}`}
                    onClick={(e) => amplitudeFilterKlikk('organisasjon', 'hovedenhet', e.target)}
                >
                    <BodyShort size="medium" as="span">
                        {hovedenhet.Name}
                    </BodyShort>
                </Checkbox>
            </div>
        </div>
    );
};
