import React from "react";
import "./VirksomhetChips.css"
import {Hovedenhet, Underenhet} from "./Virksomhetsikoner/Virksomhetsikoner";
import {BodyShort, Button} from "@navikt/ds-react";
import {Close, Office1, Office2} from "@navikt/ds-icons";


type VirksomhetChipsProp = {
    navn: String,
    orgnr: String,
    antallUndervirksomheter?: string,
    onLukk: () => void,
}

const VirksomhetChips = ({navn, orgnr, antallUndervirksomheter, onLukk}:VirksomhetChipsProp) => {
    console.log(antallUndervirksomheter);
    return <li className="virksomhetschips">
        { antallUndervirksomheter !== undefined ? <Office2 width="1.5rem"/> : <Office1 width="1rem"/> }
        <div className="virksomhetschips_innhold">
            <BodyShort size="medium" className="virksomhetschips_virksomhet">{navn}</BodyShort>
            <BodyShort size="small">virksomhetsn.nr {orgnr}</BodyShort>
            {antallUndervirksomheter !== undefined ?
                <BodyShort size="small"> {antallUndervirksomheter} virksomheter </BodyShort> : null
            }
        </div>
        <Button
            onClick={ () => onLukk() }
            variant="tertiary" className="virksomhetschips_lukkeknapp">
            <Close/>
        </Button>
    </li>
}




export default VirksomhetChips