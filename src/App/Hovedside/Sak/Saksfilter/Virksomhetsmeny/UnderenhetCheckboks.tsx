import {BodyShort, Checkbox, Label} from "@navikt/ds-react";
import React from "react";
import { Underenhet} from "./Virksomhetsmeny";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";


export const UnderenhetCheckboks = ({underenhet}: {underenhet: Underenhet}) => {
    return <div className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet">
        <Checkbox
            value={underenhet.orgnr}
            id={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
        >

        </Checkbox>
        <label
            htmlFor={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold"
        >
            <UnderenhetIkon/>
            <div
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold_tekst">
                <Label size="small" as="span"> {underenhet.name} </Label>
                <BodyShort size="small"> {underenhet.orgnr} </BodyShort>
            </div>
        </label>
    </div>
}