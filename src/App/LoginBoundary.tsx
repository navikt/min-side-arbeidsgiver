import React, { FunctionComponent, useEffect, useState } from 'react';
import { LoggInn } from './LoggInn/LoggInn';
import environment from '../utils/environment';
import { sjekkInnlogget } from '../api/dnaApi';
import Spinner from './Spinner';

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

export const tilgangFromTruthy: (e: boolean) => Tilgang =
    e => e ? Tilgang.TILGANG : Tilgang.IKKE_TILGANG;

const LoginBoundary: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Tilgang.LASTER);

    useEffect(() => {
        const signal = new AbortController().signal;
        console.log('environment.MILJO', environment.MILJO);
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs' || environment.MILJO === 'labs-gcp') {
            sjekkInnlogget(signal)
                .then(tilgangFromTruthy)
                .then(setInnlogget);
        } else {
            const harIdtoken = document.cookie.includes('selvbetjening-idtoken');
            setInnlogget(tilgangFromTruthy(harIdtoken));
        }
    }, []);

    if (innlogget === Tilgang.TILGANG) {
        return <> {props.children} </>;
    } else if (innlogget === Tilgang.IKKE_TILGANG) {
        return <LoggInn />;
    } else {
        return <Spinner />;
    }
};

export default LoginBoundary;
