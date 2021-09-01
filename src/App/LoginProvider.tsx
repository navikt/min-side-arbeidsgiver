import React, { FunctionComponent, useEffect, useState } from 'react';
import { sjekkInnlogget } from '../api/dnaApi';

export enum Innlogget {
    LASTER,
    IKKE_INNLOGGET,
    INNLOGGET,
}

interface Context {
    innlogget: Innlogget
}

export const LoginContext = React.createContext<Context>({
    innlogget: Innlogget.LASTER
});

export const LoginProvider: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Innlogget.LASTER);

    useEffect(() => {
        sjekkInnlogget()
            .then(innlogget => {
                setInnlogget(innlogget ? Innlogget.INNLOGGET : Innlogget.IKKE_INNLOGGET)
            })
    }, []);

    const state = {
        innlogget: innlogget
    };

    return <LoginContext.Provider value={state}>
        {props.children}
    </LoginContext.Provider>
};
