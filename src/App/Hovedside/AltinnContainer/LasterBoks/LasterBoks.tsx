import React from 'react';
import './LasterBoks.less';
import Innholdsboks from '../../Innholdsboks/Innholdsboks';
import NavFrontendSpinner from 'nav-frontend-spinner';

const LasterBoks: React.FunctionComponent = () => (
    <Innholdsboks className={'laster'}>
        <NavFrontendSpinner />
    </Innholdsboks>
);

export default LasterBoks;
