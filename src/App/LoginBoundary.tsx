import React, { FunctionComponent, useEffect, useState } from 'react';
import environment from '../utils/environment';
import { LoggInn } from './LoggInn/LoggInn';
import { sjekkInnlogget } from '../api/dnaApi';
import Spinner from './Spinner';

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

export const tilgangFromTruthy: (e: boolean) => Tilgang = e =>
    e ? Tilgang.TILGANG : Tilgang.IKKE_TILGANG;

const LoginBoundary: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Tilgang.LASTER);

    useEffect(() => {
        const signal = new AbortController().signal;
        if (
            environment.MILJO === 'prod-sbs' ||
            environment.MILJO === 'dev-sbs' ||
            environment.MILJO === 'labs-gcp'
        ) {
            sjekkInnlogget(signal)
                .then(tilgangFromTruthy)
                .then(setInnlogget);
        } else {
            const harIdtoken = document.cookie.includes('selvbetjening-idtoken');
            setInnlogget(tilgangFromTruthy(harIdtoken));
        }
    }, []);

    return (
        <>
            {innlogget === Tilgang.TILGANG ? (
                props.children
            ) : innlogget === Tilgang.IKKE_TILGANG ? (
                <LoggInn />
            ) : (
                <Spinner />
            )}
        </>
    );
};

export default LoginBoundary;
