import React from "react"
import {Office1, Office2} from "@navikt/ds-icons";

interface UnderenhetProps {
    style?: React.CSSProperties
}

export const Underenhet = ({style}: UnderenhetProps) =>
    <Office1 width='1rem' style={style} title='Underenhet' />;