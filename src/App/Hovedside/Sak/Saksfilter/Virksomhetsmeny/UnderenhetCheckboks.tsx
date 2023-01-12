import {BodyShort, Checkbox, Label} from "@navikt/ds-react";
import React from "react";
import { Underenhet} from "./Virksomhetsmeny";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";


export const UnderenhetCheckboks = ({underenhet}: {underenhet: Underenhet}) => {
    return <div className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet">
        <Checkbox
            value={underenhet.OrganizationNumber}
            id={`${underenhet.OrganizationNumber}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
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