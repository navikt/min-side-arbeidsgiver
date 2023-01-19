import React from "react";
import "./VirksomhetChips.css"
import {BodyShort, Button} from "@navikt/ds-react";
import {Close} from "@navikt/ds-icons";
import {Hovedenhet, Underenhet} from "./Virksomhetsikoner/Virksomhetsikoner";


type VirksomhetChipsProp = {
    navn: String,
    orgnr: String,
    antallUndervirksomheter?: number | null,
    onLukk: () => void,
}

export const VirksomhetChips = ({navn, orgnr, antallUndervirksomheter, onLukk}:VirksomhetChipsProp) => {
    const erHovedenhet = antallUndervirksomheter !== null;
    return <li className="virksomhetschips">
        {erHovedenhet ? <Hovedenhet/> : <Underenhet/>}
        <div className="virksomhetschips_innhold">
            <BodyShort size="medium" className="virksomhetschips_virksomhet">{navn}</BodyShort>
            <BodyShort size="small">
                {erHovedenhet ? "org. nr." : "virksomhetsnr."} {orgnr}</BodyShort>
            {
                erHovedenhet ?
                    <BodyShort size="small"> {antallUndervirksomheter} underenheter </BodyShort>
                    : null
            }
        </div>
        <Button
            onClick={ () => onLukk() }
            variant="tertiary" className="virksomhetschips_lukkeknapp">
            <Close title={ `fjern ${erHovedenhet? "hovedenhet" : "underenhet"} ${navn} fra valgte`}/>
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




