import React from 'react';
import Lenke, { Props } from 'nav-frontend-lenker';
import NyFaneIkon from '../App/InformasjonOmBedrift/ikoner/NyFaneIkon';

export const NyFaneLenke = (props: Props) => (
    <Lenke target="_blank" {...props}>
        <span>{props.children}</span> <NyFaneIkon />
    </Lenke>
);
