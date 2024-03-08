import React, { forwardRef } from 'react';
import { HelpText } from '@navikt/ds-react';

export type Props = {
    id?: string;
};

export const OmSaker = forwardRef<HTMLButtonElement, Props>(({ id }, ref) => (
    <HelpText id={id} ref={ref} title="Hva vises her?" aria-label="Hva vises her?">
        Her vises meldinger for:
        <ul style={{ marginTop: '4px' }}>
            <li>Inntektsmelding for sykepenger</li>
            <li>Kandidater til dine stillinger</li>
            <li>Permitteringer, oppsigelser eller innskrenkning i arbeidstid</li>
            <li>Refusjon av sykepenger i arbeidsgiverperioden</li>
            {/*<li>Yrkesskade (kun meldinger sendt inn etter XXX vises)</li>*/}
        </ul>
        Vi jobber med at flere saker skal vises her etter hvert.
    </HelpText>
));
