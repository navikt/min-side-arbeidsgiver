import React, { FunctionComponent, useContext } from 'react';
import { SpinnerMedBanner } from './Spinner';
import { Innlogget, LoginContext } from './LoginProvider';

const LoginBoundary: FunctionComponent = props => {
    const {innlogget} = useContext(LoginContext)

    if (innlogget === Innlogget.INNLOGGET) {
        return <>{props.children}</>
    } else if (innlogget === Innlogget.IKKE_INNLOGGET) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null
    } else {
        return <SpinnerMedBanner />
    }
};

export default LoginBoundary;
