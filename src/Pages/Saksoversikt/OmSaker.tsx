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
            <li>Inntektsmelding for foreldrepenger, svangerskapspenger og pleiepenger</li>
            <li>Avtaler om tiltak (lønnstilskudd, arbeidstrening, inkludering - og mentortilskudd og sommerjobb)</li>
            <li>Dialogmøte</li>
            <li>Oppfølging</li>
            <li>Kandidater til dine stillinger</li>
            <li>Permitteringer, nedbemanning og innskrenkning i arbeidstid</li>
            <li>Refusjon av sykepenger i arbeidsgiverperioden</li>
            <li>Skademelding for yrkesskade og yrkessykdom, innsendt etter 11. april 2024</li>
        </ul>
        Vi jobber med at flere saker skal vises her etter hvert.
    </HelpText>
));
