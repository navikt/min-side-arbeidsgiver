import React, { FunctionComponent } from 'react';
import { Spinner } from './Spinner';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { Alert } from '@navikt/ds-react';
import { SimpleBanner } from './HovedBanner/HovedBanner';
import { useUserInfo } from './useUserInfo';

export const LoginBoundary: FunctionComponent = (props) => {
    const { loaded, errorStatus } = useUserInfo();

    let innlogget: Innlogget;
    if (!loaded) {
        innlogget = Innlogget.LASTER;
    } else if (errorStatus === 401) {
        innlogget = Innlogget.IKKE_INNLOGGET;
    } else {
        innlogget = Innlogget.INNLOGGET;
    }

    if (innlogget === Innlogget.INNLOGGET) {
        return <>{props.children}</>;
    } else if (innlogget === Innlogget.IKKE_INNLOGGET) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null;
    } else if (innlogget === Innlogget.LASTER) {
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
        setBreadcrumbs([
            {
                url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver',
                title: 'Min side – arbeidsgiver',
            },
        ]).then(() => {});
        return (
            <>
                <SimpleBanner />
                <Alert variant="error">Uventet feil. Prøv å last siden på nytt.</Alert>
            </>
        );
    }
};

export enum Innlogget {
    LASTER,
    IKKE_INNLOGGET,
    INNLOGGET,
}
