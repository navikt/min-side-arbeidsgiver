import React, {FunctionComponent, useContext, useState} from 'react';
import {OrganisasjonerOgTilgangerContext, SyfoTilgang} from '../OrganisasjonerOgTilgangerProvider';
import {Alert, BodyShort, Heading} from "@navikt/ds-react";
import "./DigiSyfoBedriftsmenyInfo.less";
import Lukknapp from "nav-frontend-lukknapp";

const localStorageKey = 'DigiSyfoBedriftsmenyInfoLukket';
export const DigiSyfoBedriftsmenyInfo: FunctionComponent = () => {
    const { tilgangTilSyfo } = useContext(OrganisasjonerOgTilgangerContext);
    const [erLukketTidligere, setErLukketTidligere] = useState(window.localStorage.getItem(localStorageKey) != null);

    const lukkOgSkrivTilLocalstorage = () => {
        window.localStorage.setItem(localStorageKey, new Date().toDateString());
        setErLukketTidligere(true);
    };

    if (erLukketTidligere || tilgangTilSyfo !== SyfoTilgang.TILGANG) {
        return null;
    }

    return (
        <div className={"digisyfo-bedriftsmeny-info"}>
            <Alert variant="info" className={"digisyfo-bedriftsmeny-info__alert"}>
                <Heading size="small" spacing={true} >
                    Sykemeldte er nå koblet til virksomhetsvelgeren
                </Heading>
                <BodyShort>
                    Velg virksomhet for å se sykemeldte du skal følge opp der. Boksen “Sykemeldte” vises bare når du har
                    noen sykemeldt å følge opp på valgt virksomhet.
                </BodyShort>
            </Alert>
            <Lukknapp className={'lukk-knapp'} onClick={lukkOgSkrivTilLocalstorage}>Lukk</Lukknapp>
        </div>
    );
};
