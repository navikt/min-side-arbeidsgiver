import React from 'react';
import './VirksomhetChips.css';

import { Chips } from "@navikt/ds-react";

type VirksomhetChipsProp = {
    navn: string,
    erHovedenhet: boolean,
    onLukk: () => void,
}

export const VirksomhetChips = ({ navn, erHovedenhet, onLukk }: VirksomhetChipsProp) => {
    const tekst = erHovedenhet ? `Hovedenhet: ${navn}` : `Underenhet: ${navn}`
    return <Chips.Removable onClick={onLukk}>{tekst}</Chips.Removable>
};

