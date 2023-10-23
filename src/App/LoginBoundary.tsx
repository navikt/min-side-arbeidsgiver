import React, { FunctionComponent } from 'react';
import { Spinner } from './Spinner';
import { SimpleBanner } from './HovedBanner/HovedBanner';
import { useUserInfo } from './useUserInfo';

export const LoginBoundary: FunctionComponent = (props) => {
    const { loaded, errorStatus } = useUserInfo();

    if (errorStatus === 401) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null;
    } else if (!loaded) {
        return (
            <>
                <SimpleBanner />
                <Spinner />
            </>
        );
    } else {
        return <>{props.children}</>;
    }
};
