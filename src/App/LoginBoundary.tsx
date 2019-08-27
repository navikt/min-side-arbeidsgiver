import React, { FunctionComponent, useEffect, useState } from 'react';
import { LoggInn } from './LoggInn/LoggInn';

import { veilarbStepup } from '../lenker';
import environment from '../utils/environment';
import hentVeilarbStatus, { VeilStatus } from '../api/veilarbApi';

export enum Innlogget {
    LASTER,
    IKKE_INNLOGGET,
    INNLOGGET,
}

function setEssoCookieLocally() {
    document.cookie = 'nav-esso=0123456789..*; path=/; domain=localhost;';
}
function getEssoToken(veilarbStatusRespons: VeilStatus) {
    if (!veilarbStatusRespons.erInnlogget) {
        window.location.href = veilarbStepup();
    }
}
const LoginBoundary: FunctionComponent = props => {
    const [innlogget, setInnlogget] = useState(Innlogget.LASTER);

    function localLogin() {
        console.log('local login');
        if (document.cookie.includes('selvbetjening-idtoken')) {
            setInnlogget(Innlogget.INNLOGGET);
        } else {
            setInnlogget(Innlogget.IKKE_INNLOGGET);
        }
        setEssoCookieLocally();
    }

    const settInnloggetState = (veilarbStatusRespons: VeilStatus) => {
        if (veilarbStatusRespons.harGyldigOidcToken && veilarbStatusRespons.nivaOidc === 4) {
            setInnlogget(Innlogget.INNLOGGET);
            getEssoToken(veilarbStatusRespons);
        } else if (!veilarbStatusRespons.harGyldigOidcToken) {
            setInnlogget(Innlogget.IKKE_INNLOGGET);
        }
    };
    useEffect(() => {
        setInnlogget(Innlogget.LASTER);
        const getLoginStatus = async () => {
            return await hentVeilarbStatus();
        };
        if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs') {
            getLoginStatus().then(veilarbStatusRespons => {
                settInnloggetState(veilarbStatusRespons);
            });
        } else {
            localLogin();
        }
    }, []);

    if (innlogget === Innlogget.INNLOGGET) {
        return <> {props.children} </>;
    }
    if (innlogget === Innlogget.IKKE_INNLOGGET) {
        return <LoggInn />;
    } else {
        return null;
    }
};

export default LoginBoundary;
