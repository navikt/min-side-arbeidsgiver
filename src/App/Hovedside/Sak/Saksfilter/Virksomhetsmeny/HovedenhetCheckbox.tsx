import {BodyShort, Checkbox} from "@navikt/ds-react";
import React from "react";
import "./HovedenhetCheckbox.css";
import {Set} from 'immutable'
import { Organisasjon } from '../../../../../altinn/organisasjon';


type HovedenhetCheckboxProp = {
    hovedenhet: Organisasjon,
    valgteOrgnr: Set<string>,
}

export const HovedenhetCheckbox = (
    (
        {
            hovedenhet,
            valgteOrgnr,
        }: HovedenhetCheckboxProp,
    ) => {
        const valgt = valgteOrgnr.has(hovedenhet.OrganizationNumber)

        return <div
                role="menuitemcheckbox"
                aria-checked={valgt}
                aria-expanded={valgt} // TODO: if no underenheter shown because of search, then don't have property ?
            >
                <div className="hovedenhet">
                    <Checkbox
                        value={hovedenhet.OrganizationNumber}
                        id={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                        key={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_list_key`}
                        style={{display: "flex", alignItems: "center"}}
                    >
                    </Checkbox>
                    <label
                        htmlFor={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                    >
                        <BodyShort size="medium" as="span">{hovedenhet.Name}</BodyShort>
                        <BodyShort size="small">Org.nr. {hovedenhet.OrganizationNumber}</BodyShort>
                    </label>
                </div>
            </div>
    })