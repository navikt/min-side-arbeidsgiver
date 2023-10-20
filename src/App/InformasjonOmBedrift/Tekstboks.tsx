import React from 'react';
import './Tekstboks.css';

interface Props {
    className?: string;
}

const Tekstboks: React.FunctionComponent<Props> = props => (
    <div className={['tekstboks', props.className ?? ''].join(' ')}>{props.children}</div>
);

export default Tekstboks;
