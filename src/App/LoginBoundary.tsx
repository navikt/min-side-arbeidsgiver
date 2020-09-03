import React, { FunctionComponent, useEffect, useState } from 'react';
import { LoggInn } from './LoggInn/LoggInn';
import environment from '../utils/environment';
import { sjekkInnlogget } from '../api/dnaApi';

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
}

const LoginBoundary: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Tilgang.LASTER);

    const localLogin = () => {
        if (document.cookie.includes('selvbetjening-idtoken')) {
            setInnlogget(Tilgang.TILGANG);
        } else {
            setInnlogget(Tilgang.IKKE_TILGANG);
        }
    };

    useEffect(() => {
        setInnlogget(Tilgang.LASTER);
        const getLoginStatus = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs') {
                let innloggingsstatus = await sjekkInnlogget(signal);
                if (innloggingsstatus) {
                    setInnlogget(Tilgang.TILGANG);
                } else {
                    setInnlogget(Tilgang.IKKE_TILGANG);
                }
            } else {
                localLogin();
            }
        };
        getLoginStatus();
    }, []);

    if (innlogget === Tilgang.TILGANG) {
        return <> {props.children} </>;
    }
    if (innlogget === Tilgang.IKKE_TILGANG) {
        return <LoggInn />;
    } else {
        return null;
    }
};

export default LoginBoundary;
