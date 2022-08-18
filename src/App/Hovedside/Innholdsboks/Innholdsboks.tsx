import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import './Innholdsboks.css';

interface Props {
    classname?: string;
}

const Innholdsboks: FunctionComponent<Props> = props => (
    <div className={classNames('innholdsboks', props.classname)}>{props.children}</div>
);

export default Innholdsboks;
