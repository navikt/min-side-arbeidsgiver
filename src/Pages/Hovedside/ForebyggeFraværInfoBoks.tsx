import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Alert, BodyShort, Heading} from "@navikt/ds-react"
import {Lukknapp} from "../../GeneriskeElementer/Lukknapp"
import amplitude from "../../utils/amplitude";
import "./ForebyggeFraværInfoBoks.css"
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { lenkeTilForebyggingsplan } from '../../lenker';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';

const localStorageKey = 'ForebyggeFraværInfoBoksLukket';
export const ForebyggeFraværInfoBoks: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [erLukketTidligere, setErLukketTidligere] = useState(window.localStorage.getItem(localStorageKey) != null);

    const lukkOgSkrivTilLocalstorage = () => {
        window.localStorage.setItem(localStorageKey, new Date().toDateString());
        setErLukketTidligere(true);
    };

    const showFrom = new Date('2023-04-05T00:00:00+02:00')
    const showUntil = new Date('2023-04-20T23:59:59+02:00')
    const currentTime = new Date()

    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'ForebyggeFraværInfoBoks',
            erLukket: erLukketTidligere,
            forebyggefravarTilgang: valgtOrganisasjon?.altinntilgang.forebyggefravar
        })
    }, [valgtOrganisasjon?.reporteetilgang, erLukketTidligere]);

    if (
        erLukketTidligere
        || !valgtOrganisasjon
        || (!valgtOrganisasjon.altinntilgang.forebyggefravar )
        || !shouldDisplay({ showFrom, currentTime, showUntil })
    ) {
        return null;
    }

    return (
        <Alert className="forebygge_fravær_info" variant="info">
            <div className="forebygge_fravær_info__container">
                <div className="forebygge_fravær_info__content">
                    <Heading size="small" level="2">
                        Ønsker du å få ned fraværet i virksomheten?
                    </Heading>
                    <BodyShort>
                        Få tips om hva du kan gjøre og lag en plan for arbeidet fremover. Gå til
                        <LenkeMedLogging
                            loggLenketekst="Forebyggingsplan ForebyggeFraværInfoBoks"
                            href={lenkeTilForebyggingsplan+`?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`}
                        >
                            Forebygge fravær
                        </LenkeMedLogging>
                    </BodyShort>
                </div>
                <Lukknapp className={'forebygge_fravær_info__lukk-knapp'} onClick={lukkOgSkrivTilLocalstorage} />
            </div>
        </Alert>
    );
};