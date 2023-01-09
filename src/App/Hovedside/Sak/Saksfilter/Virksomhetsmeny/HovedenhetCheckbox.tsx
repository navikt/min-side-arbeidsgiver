import {BodyShort, Button, Checkbox, Label} from "@navikt/ds-react";
import {Hovedenhet as HovedenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";
import {Collapse, Expand} from "@navikt/ds-icons";
import React from "react";
import "./HovedenhetCheckbox.css";
import {Hovedenhet} from "./Virksomhetsmeny";

export const HovedenhetCheckbox = ({ hovedenhet, erÅpen, setErÅpen,  children}: { hovedenhet: Hovedenhet, erÅpen: boolean, setErÅpen: (a: boolean) => void, children: React.ReactNode }) => {
    return <>
    <div className="hovedenhet_container">
        <div className="hovedenhet">
            <Checkbox
                value={hovedenhet.orgnr}
                id={`${hovedenhet.orgnr}_Virksomhetsmeny_checkbox`}
                key={`${hovedenhet.orgnr}_Virksomhetsmeny_list_key`}
                style={{display: "flex", alignItems: "center"}}
            >
            </Checkbox>
            <label
                className="hovedenhet_innhold"
                htmlFor={`${hovedenhet.orgnr}_Virksomhetsmeny_checkbox`}
            >
                <HovedenhetIkon/>
                <div>
                    <Label size="medium" as="span">{hovedenhet.name}</Label>
                    <BodyShort size="small">Org. nr. {hovedenhet.orgnr}</BodyShort>
                    <BodyShort size="small">{hovedenhet.underenheter.length} virksomheter</BodyShort>
                </div>
            </label>

        </div>
        <Button
            variant="tertiary"
            style={{width: "100%"}}
            onClick={() => {
                setErÅpen(!erÅpen)
            }}
            className="hovedenhet_vis-skjul-container"
        >
            <BodyShort
                size="small"
                className="hovedenhet_vis-skjul"
            >{erÅpen ? <Collapse/> : <Expand/>} {erÅpen ? "skjul" : "vis"} virksomheter</BodyShort>
        </Button>
        </div>
        {erÅpen ? children : null}
    </>
}