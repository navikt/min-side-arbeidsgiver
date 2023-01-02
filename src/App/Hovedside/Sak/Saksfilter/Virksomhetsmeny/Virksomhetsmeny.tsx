import React from "react"
import {BodyShort, Select} from "@navikt/ds-react";
import {Expand} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"

type VirksomhetsmenyProps = {
    virksomheter: Array<any>,
    fjernVirksomhet: (a: any) => void,
    children: React.ReactNode
}
export const Virksomhetsmeny = ({virksomheter, fjernVirksomhet, children}: VirksomhetsmenyProps) => {

    return <div className="saksfilter_virksomheter">
        <button className="saksfilter_virksomheter_menyknapp">
            <BodyShort> Velg virksomheter </BodyShort>
            <Expand/>
        </button>
        {children}
    </div>
}