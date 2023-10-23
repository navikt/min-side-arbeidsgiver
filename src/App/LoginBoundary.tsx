import React, { FunctionComponent } from 'react';
import { Spinner } from './Spinner';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { SimpleBanner } from './HovedBanner/HovedBanner';
import { useUserInfo } from './useUserInfo';

export const LoginBoundary: FunctionComponent = (props) => {
    const { loaded, errorStatus } = useUserInfo();

    if (errorStatus === 401) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null;
    } else if (!loaded) {
        setBreadcrumbs([
            {
                url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver',
                title: 'Min side – arbeidsgiver',
            },
        ]).then(() => {});
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
