import {BodyShort, Checkbox} from "@navikt/ds-react";
import React  from "react";
import {Set} from 'immutable';
import { Organisasjon } from '../../../../../altinn/organisasjon';


type UnderenhetCheckboksProps = {
    valgteOrgnr: Set<string>;
    underenhet: Organisasjon;
};

export const UnderenhetCheckboks = (
    {underenhet, valgteOrgnr}: UnderenhetCheckboksProps
) => {
    return <div className="sak_virksomhetsmeny_underenhet"
                role="menuitemcheckbox"
                aria-checked={valgteOrgnr.has(underenhet.OrganizationNumber)}>
        <Checkbox
            value={underenhet.OrganizationNumber}
            id={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
        > </Checkbox>
        <label htmlFor={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}>
            <BodyShort size="small" as="span"> {underenhet.Name} </BodyShort>
            <BodyShort size="small"> {underenhet.OrganizationNumber} </BodyShort>
        </label>
    </div>
}