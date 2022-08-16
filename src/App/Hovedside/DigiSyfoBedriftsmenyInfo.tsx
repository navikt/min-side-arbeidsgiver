import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {OrganisasjonerOgTilgangerContext, SyfoTilgang} from '../OrganisasjonerOgTilgangerProvider';
import {Alert, BodyShort, Heading} from "@navikt/ds-react";
import "./DigiSyfoBedriftsmenyInfo.less";
import {Lukknapp} from "../../GeneriskeElementer/Lukknapp";
import amplitude from "../../utils/amplitude";

const localStorageKey = 'DigiSyfoBedriftsmenyInfoLukket';
export const DigiSyfoBedriftsmenyInfo: FunctionComponent = () => {
    const {tilgangTilSyfo} = useContext(OrganisasjonerOgTilgangerContext);
    const [erLukketTidligere, setErLukketTidligere] = useState(window.localStorage.getItem(localStorageKey) != null);

    const lukkOgSkrivTilLocalstorage = () => {
        window.localStorage.setItem(localStorageKey, new Date().toDateString());
        setErLukketTidligere(true);
    };

    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'DigiSyfoBedriftsmenyInfo',
            erLukket: erLukketTidligere,
            tilgangTilSyfo: SyfoTilgang[tilgangTilSyfo]
        })
    }, [tilgangTilSyfo, erLukketTidligere]);

    if (erLukketTidligere || tilgangTilSyfo !== SyfoTilgang.TILGANG) {
        return null;
    }

    return (
        <Alert className="digisyfo-bedriftsmeny-info" variant="info">
            <div className="digisyfo-bedriftsmeny-info__container">
                <div className="digisyfo-bedriftsmeny-info__content">
                    <Heading size="small" level="2">
                        Sykmeldte er nå koblet til virksomhetsvelgeren
                    </Heading>
                    <BodyShort>
                        Velg virksomhet for å se sykmeldte du skal følge opp der. Boksen “Sykmeldte” vises bare når du har
                        noen sykmeldt å følge opp på valgt virksomhet.
                    </BodyShort>
                </div>
                <Lukknapp className={'digisyfo-bedriftsmeny-info__lukk-knapp'} onClick={lukkOgSkrivTilLocalstorage} />
            </div>
        </Alert>
    );
};
