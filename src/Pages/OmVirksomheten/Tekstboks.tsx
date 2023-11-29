import React, { PropsWithChildren } from 'react';
import './Tekstboks.css';

interface Props {
    className?: string;
}

const Tekstboks: React.FunctionComponent<PropsWithChildren<Props>> = (props) => (
    <div className={['tekstboks', props.className ?? ''].join(' ')}>{props.children}</div>
);

export default Tekstboks;
