import React from 'react';

import { Chips } from '@navikt/ds-react';

export const VirksomhetChips = ({
    navn,
    erHovedenhet,
    onLukk,
}: {
    navn: string;
    erHovedenhet: boolean;
    onLukk: () => void;
}) => {
    const tekst = erHovedenhet ? `Hovedenhet: ${navn}` : `Underenhet: ${navn}`;
    return (
        <Chips.Removable variant="neutral" onClick={onLukk}>
            {tekst}
        </Chips.Removable>
    );
};
