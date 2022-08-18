import React from 'react';
import classNames from 'classnames';
import './Tekstboks.css';

interface Props {
    className?: string;
}

const Tekstboks: React.FunctionComponent<Props> = props => (
    <div className={classNames('tekstboks', props.className)}>{props.children}</div>
);

export default Tekstboks;
