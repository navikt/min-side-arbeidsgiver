import {BodyShort, Button, Checkbox, Label} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import React, {useRef} from "react";
import "./HovedenhetCheckbox.css";
import { Hovedenhet, Organisasjon } from './Virksomhetsmeny';
import {useKeyboardEvent} from "../../../../hooks/useKeyboardEvent";
import {Set} from 'immutable'


type HovedenhetCheckboxProp = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    hovedenhet: Organisasjon,
    valgteOrgnr: Set<string>,
    tabbable: boolean,
    antallUnderenheter: number,
    antallValgteUnderenheter: number,
}

export const HovedenhetCheckbox = (
    (
        {
            setEnhetRef,
            hovedenhet,
            valgteOrgnr,
            tabbable,
            antallUnderenheter,
            antallValgteUnderenheter,
        }: HovedenhetCheckboxProp,
    ) => {
        const valgt = valgteOrgnr.has(hovedenhet.OrganizationNumber)

        const virksomheter = (n: number) => `virksomhet${n > 1 ? 'er' : ''}`

        const valgBeskrivelse = antallValgteUnderenheter === 0
            ? `${antallUnderenheter} ${virksomheter(antallUnderenheter)}`
            : `${antallValgteUnderenheter} av ${antallUnderenheter} ${virksomheter(antallUnderenheter)} valgt`

        return <div
                className="hovedenhet_container"
                role="menuitemcheckbox"
                aria-checked={valgt}
                aria-expanded={valgt} // TODO: if no underenheter shown because of search, then don't have property ?
            >
                <div className="hovedenhet">
                    <Checkbox
                        ref={input => input !== null && setEnhetRef(hovedenhet.OrganizationNumber, input)}
                        value={hovedenhet.OrganizationNumber}
                        id={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                        key={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_list_key`}
                        style={{display: "flex", alignItems: "center"}}
                        tabIndex={tabbable ? 0 : -1}
                    >
                    </Checkbox>
                    <label
                        className="hovedenhet_innhold"
                        htmlFor={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                    >
                        <div>
                            <Label size="medium" as="span">{hovedenhet.Name}</Label>
                            <BodyShort size="small">Org. nr. {hovedenhet.OrganizationNumber}</BodyShort>
                            <BodyShort size="small">{valgBeskrivelse}</BodyShort>
                        </div>
                    </label>
                </div>
            </div>
    })