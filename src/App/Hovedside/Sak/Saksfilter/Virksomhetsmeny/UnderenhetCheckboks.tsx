import {BodyShort, Checkbox} from "@navikt/ds-react";
import React from "react";
import {forceCheckedEnum, Underenhet} from "./Virksomhetsmeny";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";


export const UnderenhetCheckboks = ({underenhet, forceChecked, setForceChecked}: {underenhet: Underenhet, forceChecked: forceCheckedEnum, setForceChecked: (a: forceCheckedEnum) => void}) => {
    return <div className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet">
        <Checkbox id={`${underenhet.orgnr}_UnderenhetCheckbox_id`}
                  className="virksomheter_virksomhetsmeny_sok_checkbox_underenheter_checkbox"
                  checked={forceChecked === forceCheckedEnum.FORCECHECKED ? true : forceChecked === forceCheckedEnum.FORCEUNCHECKED ? false : undefined}
                  onClick={() => setForceChecked(forceCheckedEnum.NOTFORCED)}
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