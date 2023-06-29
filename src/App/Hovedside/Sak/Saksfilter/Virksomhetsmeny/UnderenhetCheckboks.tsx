import {BodyShort, Checkbox, Label} from "@navikt/ds-react";
import React, {useRef} from "react";
import { Organisasjon } from './Virksomhetsmeny';
import {Underenhet as UnderenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";
import {useKeyboardEvent} from "../../../../hooks/useKeyboardEvent";
import {Set} from 'immutable';


type UnderenhetCheckboksProps = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    valgteOrgnr: Set<string>;
    underenhet: Organisasjon;
    gåTilForrige: () => void;
    gåTilNeste: () => void;
    gåTilHovedenhet: () => void;
    tabbable: boolean;
};

export const UnderenhetCheckboks = (
    {setEnhetRef, underenhet, valgteOrgnr, gåTilForrige, gåTilNeste, gåTilHovedenhet, tabbable}: UnderenhetCheckboksProps
) => {
    const containerRef = useRef<HTMLDivElement>(null)
    useKeyboardEvent('keydown', containerRef, (event) => {
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
            gåTilHovedenhet()

            event.preventDefault()
            return;
        }
    })
    return <div ref={containerRef}
                className="virksomheter_virksomhetsmeny_sok_checkbox_underenhet"
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