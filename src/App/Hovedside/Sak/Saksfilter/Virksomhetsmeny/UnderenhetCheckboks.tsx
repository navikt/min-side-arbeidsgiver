import {BodyShort, Checkbox} from "@navikt/ds-react";
import React from "react";
import { Underenhet} from "./Virksomhetsmeny";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";


export const UnderenhetCheckboks = ({underenhet, valgt}: {underenhet: Underenhet, valgt: boolean}) => {
    return <div className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet">
        <Checkbox
            value={underenhet.orgnr}
            id={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
            checked={valgt}
        >

        </Checkbox>
        <label
            htmlFor={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
            className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold"
        >
            <UnderenhetIkon/>
            <div
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_innhold_tekst">
                <BodyShort size="small"> {underenhet.name} </BodyShort>
                <BodyShort> {underenhet.orgnr} </BodyShort>
            </div>
        </label>
    </div>
}