import React, { FunctionComponent, useEffect, useState } from 'react';
import { LoggInn } from './LoggInn/LoggInn';

import { veilarbStepup } from '../lenker';
import environment from '../utils/environment';
import hentVeilarbStatus, { VeilStatus } from '../api/veilarbApi';

export enum Tilgang {
    LASTER,
    IKKE_TILGANG,
    TILGANG,
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
    const [innlogget, setInnlogget] = useState(Tilgang.LASTER);

    function localLogin() {
        if (document.cookie.includes('selvbetjening-idtoken')) {
            setInnlogget(Tilgang.TILGANG);
        } else {
            setInnlogget(Tilgang.IKKE_TILGANG);
        }
        setEssoCookieLocally();
    }

    useEffect(() => {
        setInnlogget(Tilgang.LASTER);
        const getLoginStatus = async () => {
            if (environment.MILJO === 'prod-sbs' || environment.MILJO === 'dev-sbs') {
                let veilarbStatusRespons = await hentVeilarbStatus();
                if (
                    veilarbStatusRespons.harGyldigOidcToken &&
                    veilarbStatusRespons.nivaOidc === 4
                ) {
                    getEssoToken(veilarbStatusRespons);
                    setInnlogget(Tilgang.TILGANG);
                } else if (!veilarbStatusRespons.harGyldigOidcToken) {
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
    if (innlogget === Tilgang.IKKE_TILGANG || innlogget === Tilgang.LASTER) {
        return <LoggInn loggetInn={innlogget} />;
    } else {
        return null;
    }
};

export default LoginBoundary;
