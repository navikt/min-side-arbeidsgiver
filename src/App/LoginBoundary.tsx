import React, { FunctionComponent } from 'react';
import { Spinner } from './Spinner';
import { SimpleBanner } from './HovedBanner/HovedBanner';
import { useUserInfo } from './useUserInfo';
import { Alert } from '@navikt/ds-react';

export const LoginBoundary: FunctionComponent = (props) => {
    const { userInfo, errorStatus, isError } = useUserInfo();

    if (errorStatus === 401) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null;
    } else if (userInfo !== undefined) {
        return <>{props.children}</>;
    } else if (isError) {
        return (
            <>
                <SimpleBanner />
                <div style={{ width: '60rem', margin: '32px auto' }}>
                    <Alert variant="error">Uventet feil. Prøv å last siden på nytt.</Alert>
                </div>
            </>
        );
    } else {
        return (
            <>
                <SimpleBanner />
                <Spinner />
            </>
        );
    }
};
