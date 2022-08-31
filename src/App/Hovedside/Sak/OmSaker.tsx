import React, { forwardRef } from 'react';
import { HelpText } from "@navikt/ds-react";

export type Props = {
    id?: string;
}

export const OmSaker = forwardRef<HTMLButtonElement, Props>(({id}, ref) =>
    <HelpText id={id} ref={ref} title="Hva vises her?">
        <div style={{maxWidth:"25rem"}}>
            Her vises meldinger for permitteringer, oppsigelser eller innskrenkning i arbeidstid og
            refusjon av sykepenger i arbeidsgiverperioden.
            Vi jobber med at flere saker skal vises her etter hvert.
        </div>
    </HelpText>
)
