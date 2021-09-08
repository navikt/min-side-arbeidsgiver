import React from 'react';
import NyFaneIkon from '../App/InformasjonOmBedrift/ikoner/NyFaneIkon';
import { LenkeMedLogging, Props } from './LenkeMedLogging';

const NyFaneLenke = (props: Props) => (
    <LenkeMedLogging target="_blank" {...props}>
        <span>{props.children}</span> <NyFaneIkon />
    </LenkeMedLogging>
);

export default NyFaneLenke;
