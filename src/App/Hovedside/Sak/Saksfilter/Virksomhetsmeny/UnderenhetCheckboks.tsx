import {BodyShort, Checkbox, Label} from "@navikt/ds-react";
import React from "react";
import { Underenhet} from "./Virksomhetsmeny";
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";


type UnderenhetCheckboksProps = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    underenhet: Underenhet;
    gåTilForrige: () => void;
    gåTilNeste: () => void;
    gåOpp: () => void;
    onTabEvent: (shiftKey: boolean) => void;
};
export const UnderenhetCheckboks = (
    {setEnhetRef, underenhet, gåTilForrige, gåTilNeste, gåOpp, onTabEvent}: UnderenhetCheckboksProps
) => {
    return <div
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet"
                role="menuitemcheckbox"
                aria-checked={underenhet.valgt}
                onKeyDown={(event) => {
                    if (event.key === 'Tab') {
                        onTabEvent(event.shiftKey)

                        event.preventDefault()
                        return
                    }

                    if (event.key === 'ArrowUp' || event.key === 'Up') {
                        gåTilForrige()

                        event.preventDefault()
                        return;
                    }

                    if (event.key === 'ArrowDown' || event.key === 'Down') {
                        gåTilNeste()

                        event.preventDefault()
                        return;
                    }

                    if (event.key === 'ArrowLeft' || event.key === 'Left') {
                        gåOpp()

                        event.preventDefault()
                        return;
                    }

                }}>
        <Checkbox
            ref={input => input !== null && setEnhetRef(underenhet.OrganizationNumber, input)}
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