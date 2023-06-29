import {BodyShort, Checkbox, Label} from "@navikt/ds-react";
import React  from "react";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";
import {Set} from 'immutable';
import { Organisasjon } from '../../../../../altinn/organisasjon';


type UnderenhetCheckboksProps = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    valgteOrgnr: Set<string>;
    underenhet: Organisasjon;
    tabbable: boolean;
};

export const UnderenhetCheckboks = (
    {setEnhetRef, underenhet, valgteOrgnr, tabbable}: UnderenhetCheckboksProps
) => {
    return <div className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet"
                role="menuitemcheckbox"
                aria-checked={valgteOrgnr.has(underenhet.OrganizationNumber)}>
        <Checkbox
            ref={input => input !== null && setEnhetRef(underenhet.OrganizationNumber, input)}
            value={underenhet.OrganizationNumber}
            id={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
            tabIndex={tabbable ? 0 : -1}
        >

        </Checkbox>
        <label
            htmlFor={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold"
        >
            <UnderenhetIkon/>
            <div
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold_tekst">
                <Label size="small" as="span"> {underenhet.Name} </Label>
                <BodyShort size="small"> {underenhet.OrganizationNumber} </BodyShort>
            </div>
        </label>
    </div>
}