import {BodyShort, Button, Checkbox, Label} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import React, {useRef} from "react";
import "./HovedenhetCheckbox.css";
import {Hovedenhet} from "./Virksomhetsmeny";
import {useKeyboardEvent} from "../../../../hooks/useKeyboardEvent";


type HovedenhetCheckboxProp = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    hovedenhet: Hovedenhet,
    erÅpen: boolean,
    toggleÅpen: () => void,
    gåTilForrige: () => void,
    gåTilNeste: () => void,
    gåTilUnderenhet: () => void,
    children: React.ReactNode | undefined
}

export const HovedenhetCheckbox = (
    (
        {
            setEnhetRef,
            hovedenhet,
            erÅpen,
            toggleÅpen,
            gåTilForrige,
            gåTilNeste,
            gåTilUnderenhet,
            children
        }: HovedenhetCheckboxProp,
    ) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const visFlere = hovedenhet.underenheter.some(u => u.søkMatch)

        useKeyboardEvent('keydown', containerRef, (event) => {
            if (event.key === 'ArrowUp' || event.key === 'Up') {
                gåTilForrige()

                event.preventDefault()
                return;
            }

            if (event.key === 'ArrowDown' || event.key === 'Down') {
                if (visFlere && erÅpen) {
                    gåTilUnderenhet()
                } else {
                    gåTilNeste()
                }

                event.preventDefault()
                return;
            }

            if (event.key === 'ArrowRight' || event.key === 'Right') {
                if (visFlere) {
                    if (erÅpen) {
                        gåTilUnderenhet()
                    } else {
                        toggleÅpen()
                    }
                }

                event.preventDefault()
                return;
            }

            if (event.key === 'ArrowLeft' || event.key === 'Left') {
                if (visFlere && erÅpen) {
                    toggleÅpen()
                }

                event.preventDefault()
                return;
            }
        })

        return <>
            <div
                ref={containerRef}
                className="hovedenhet_container"
                role="menuitemcheckbox"
                aria-checked={hovedenhet.valgt}
                aria-expanded={hovedenhet.åpen}
            >
                <div className="hovedenhet">
                    <Checkbox
                        ref={input => input !== null && setEnhetRef(hovedenhet.OrganizationNumber, input)}
                        value={hovedenhet.OrganizationNumber}
                        id={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                        key={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_list_key`}
                        style={{display: "flex", alignItems: "center"}}
                    >
                    </Checkbox>
                    <label
                        className="hovedenhet_innhold"
                        htmlFor={`${hovedenhet.OrganizationNumber}_Virksomhetsmeny_checkbox`}
                    >
                        <div>
                            <Label size="medium" as="span">{hovedenhet.Name}</Label>
                            <BodyShort size="small">Org. nr. {hovedenhet.OrganizationNumber}</BodyShort>
                            <BodyShort size="small">{hovedenhet.underenheter.length} {hovedenhet.underenheter.length > 1 ? "virksomheter" : "virksomhet"}</BodyShort>
                        </div>
                    </label>

                </div>
                {
                    visFlere ? <Button
                            variant="tertiary"
                            style={{width: "100%"}}
                            onClick={() => {
                                toggleÅpen()
                            }}
                            className="hovedenhet_vis-skjul-container"
                        >
                            <BodyShort
                                size="small"
                                className="hovedenhet_vis-skjul"
                                aria-label={`${erÅpen ? "Skjul" : "Vis"} virksomheter for ${hovedenhet.Name}`}
                            >{erÅpen ? <Collapse aria-hidden={true} style={{pointerEvents: "none"}}/> :
                                <Expand aria-hidden={true} style={{pointerEvents: "none"}}/>} {erÅpen ? "skjul" : "vis"} virksomheter</BodyShort>
                        </Button>
                        : null
                }
            </div>
            {erÅpen ? children : null}
        </>
    })