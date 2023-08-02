import React from 'react';

import { Chips } from "@navikt/ds-react";

type VirksomhetChipsProp = {
    navn: string,
    erHovedenhet: boolean,
    onLukk: () => void,
}

export const VirksomhetChips = ({ navn, erHovedenhet, onLukk }: VirksomhetChipsProp) => {
    const tekst = erHovedenhet ? `Hovedenhet: ${navn}` : `Underenhet: ${navn}`
    return <Chips.Removable variant="neutral" onClick={onLukk}>{tekst}</Chips.Removable>
};

