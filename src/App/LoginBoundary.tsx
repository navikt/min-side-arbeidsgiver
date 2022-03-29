import React, { FunctionComponent, useContext } from 'react';
import { LoggInn } from './LoggInn/LoggInn';
import { SpinnerMedBanner } from './Spinner';
import { Innlogget, LoginContext } from './LoginProvider';

const LoginBoundary: FunctionComponent = props => {
    const {innlogget} = useContext(LoginContext)

    if (innlogget === Innlogget.INNLOGGET) {
        return <>{props.children}</>
    } else if (innlogget === Innlogget.IKKE_INNLOGGET) {
        return <LoggInn />
    } else {
        return <SpinnerMedBanner />
    }
};

export default LoginBoundary;
