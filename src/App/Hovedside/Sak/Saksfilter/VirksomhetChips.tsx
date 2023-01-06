import React from "react";
import "./VirksomhetChips.css"
import {Hovedenhet, Underenhet} from "./Virksomhetsikoner/Virksomhetsikoner";
import {BodyShort, Button} from "@navikt/ds-react";
import {Close, Office1, Office2} from "@navikt/ds-icons";


type VirksomhetChipsProp = {
    navn: String,
    orgnr: String,
    antallUndervirksomheter?: number | null,
    onLukk: () => void,
}

export const VirksomhetChips = ({navn, orgnr, antallUndervirksomheter, onLukk}:VirksomhetChipsProp) => {
    return <li className="virksomhetschips">
        { antallUndervirksomheter !== null ? <Office2 width="1.5rem"/> : <Office1 width="1rem"/> }
        <div className="virksomhetschips_innhold">
            <BodyShort size="medium" className="virksomhetschips_virksomhet">{navn}</BodyShort>
            <BodyShort size="small">{
                antallUndervirksomheter !== null ? "org. nr." : "virksomhetsnr."} {orgnr}</BodyShort>
            {antallUndervirksomheter !== null ?
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

type EkstraChipProp = {
    antall: number
}
export const EkstraChip = ({ antall }: EkstraChipProp)  => {
    return <li className="virksomhetschips_extra">
        <div className="virksomhetschips_innhold">
            <BodyShort size="medium" className="virksomhetschips_virksomhet_ekstra"> ... + {antall-7} </BodyShort>
        </div>
    </li>
}




