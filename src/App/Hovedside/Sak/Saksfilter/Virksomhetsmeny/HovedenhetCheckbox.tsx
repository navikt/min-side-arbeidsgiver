import {BodyShort, Button, Checkbox} from "@navikt/ds-react";
import {Hovedenhet as HovedenhetIkon} from "../Virksomhetsikoner/Virksomhetsikoner";
import {Collapse, Expand} from "@navikt/ds-icons";
import React from "react";
import "./HovedenhetCheckbox.css";
import {Hovedenhet} from "./Virksomhetsmeny";

export const HovedenhetCheckbox = ({ hovedenhet, valgt, children}: { hovedenhet: Hovedenhet, valgt: boolean, children: React.ReactNode }) => {
    const [erApen, setErApen] = React.useState(false);
    return <>
    <div className="hovedenhet_container">
        <div className="hovedenhet">
            <Checkbox
                value={hovedenhet.orgnr}
                id={`${hovedenhet.orgnr}_Virksomhetsmeny_checkbox`}
                key={`${hovedenhet.orgnr}_Virksomhetsmeny_list_key`}
                style={{display: "flex", alignItems: "center"}}
                checked={valgt}
            >
            </Checkbox>
            <label
                className="hovedenhet_innhold"
                htmlFor={`${hovedenhet.orgnr}_Virksomhetsmeny_checkbox`}
            >
                <HovedenhetIkon/>
                <div>
                    <BodyShort size="medium">{hovedenhet.name}</BodyShort>
                    <BodyShort size="small">Org. nr. {hovedenhet.orgnr}</BodyShort>
                    <BodyShort size="small">{hovedenhet.underenheter.length} virksomheter</BodyShort>
                </div>
            </label>

        </div>
        <Button
            variant="tertiary"
            style={{width: "100%"}}
            onClick={() => {
                setErApen(!erApen)
            }}
            className="hovedenhet_vis-skjul-container"
        >
            <BodyShort
                size="small"
                className="hovedenhet_vis-skjul"
            >{erApen ? <Collapse/> : <Expand/>} {erApen ? "skjul" : "vis"} virksomheter</BodyShort>
        </Button>
        </div>
        {erApen ? children : null}
    </>
}