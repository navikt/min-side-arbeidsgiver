import React from 'react';
import NyFaneIkon from '../Pages/OmVirksomheten/NyFaneIkon';
import { Lenke, Props } from './Lenke';

const NyFaneLenke = (props: Props) => (
    <Lenke target="_blank" {...props}>
        <span>{props.children}</span> <NyFaneIkon />
    </Lenke>
);

export default NyFaneLenke;
