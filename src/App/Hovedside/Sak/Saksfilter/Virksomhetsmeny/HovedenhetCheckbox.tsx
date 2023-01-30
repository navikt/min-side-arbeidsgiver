import {BodyShort, Button, Checkbox, Label} from "@navikt/ds-react";
import {Hovedenhet as HovedenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";
import {Collapse, Expand} from "@navikt/ds-icons";
import React from "react";
import "./HovedenhetCheckbox.css";
import {Hovedenhet} from "./Virksomhetsmeny";


type HovedenhetCheckboxProp = {
    setEnhetRef: (id: string, ref: HTMLInputElement) => void;
    hovedenhet: Hovedenhet,
    erÅpen: boolean,
    toggleÅpen: () => void,
    gåTilForrige: () => void,
    gåTilNeste: () => void,
    gåNed: () => void,
    onTabEvent: (shiftKey: boolean) => void;
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
            gåNed,
            onTabEvent,
            children
        }: HovedenhetCheckboxProp,
    ) => {
        const visFlere = hovedenhet.underenheter.some(u => u.søkMatch)
        return <>
            <div className="hovedenhet_container"
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
                         if (visFlere && erÅpen) {
                             gåNed()
                         } else {
                             gåTilNeste()
                         }

                         event.preventDefault()
                         return;
                     }

                     if (event.key === 'ArrowRight' || event.key === 'Right') {
                         if (visFlere) {
                             if (erÅpen) {
                                 gåNed()
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

                 }}>
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
                        <HovedenhetIkon/>
                        <div>
                            <Label size="medium" as="span">{hovedenhet.Name}</Label>
                            <BodyShort size="small">Org. nr. {hovedenhet.OrganizationNumber}</BodyShort>
                            <BodyShort size="small">{hovedenhet.underenheter.length} underenheter</BodyShort>
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
                                aria-label={`${erÅpen ? "Skjul" : "Vis"} underenheter for ${hovedenhet.Name}`}
                            >{erÅpen ? <Collapse aria-hidden={true} style={{pointerEvents: "none"}}/> :
                                <Expand aria-hidden={true} style={{pointerEvents: "none"}}/>} {erÅpen ? "skjul" : "vis"} underenheter</BodyShort>
                        </Button>
                        : null
                }
            </div>
            {erÅpen ? children : null}
        </>
    })