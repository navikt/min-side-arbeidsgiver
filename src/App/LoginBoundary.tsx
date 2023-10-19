import React, { FunctionComponent, useEffect, useState } from 'react';
import { Spinner } from './Spinner';
import { sjekkInnlogget } from '../api/dnaApi';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';
import { Alert } from '@navikt/ds-react';
import { SimpleBanner } from './HovedBanner/HovedBanner';

export const LoginBoundary: FunctionComponent = (props) => {
    const [innlogget, setInnlogget] = useState(Innlogget.LASTER);

    useEffect(() => {
        sjekkInnlogget()
            .then((innloggetResultat) => {
                setInnlogget(innloggetResultat ? Innlogget.INNLOGGET : Innlogget.IKKE_INNLOGGET);
            })
            .catch(() => setInnlogget(Innlogget.FEIL));
    }, []);

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
    FEIL,
}
