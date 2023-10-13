import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { SpinnerMedBanner } from './Spinner';
import { sjekkInnlogget } from '../api/dnaApi';

export const LoginBoundary: FunctionComponent = (props) => {
    const [innlogget, setInnlogget] = useState(Innlogget.LASTER);

    useEffect(() => {
        sjekkInnlogget().then((innloggetResultat) => {
            setInnlogget(innloggetResultat ? Innlogget.INNLOGGET : Innlogget.IKKE_INNLOGGET);
        });
    }, []);

    if (innlogget === Innlogget.INNLOGGET) {
        return <>{props.children}</>;
    } else if (innlogget === Innlogget.IKKE_INNLOGGET) {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
        return null;
    } else {
        return <SpinnerMedBanner />;
    }
};

export enum Innlogget {
    LASTER,
    IKKE_INNLOGGET,
    INNLOGGET,
}
