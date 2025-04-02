import React, { FunctionComponent, useEffect } from 'react';
import { infoOmTilgangsstyringURL, lenkeTilDittNavPerson } from '../../lenker';
import './ManglerTilganger.css';
import { Heading, LinkPanel } from '@navikt/ds-react';
import { LenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';
import { SimpleBanner } from '../Banner';
import { Alerts } from '../Alerts';
import { logAnalyticsEvent } from '../../utils/analytics';

export const ManglerTilganger: FunctionComponent = () => {
    useEffect(() => {
        logAnalyticsEvent('komponent-lastet', {
            komponent: 'ManglerTilganger',
        });
    }, []);

    return (
        <>
            <SimpleBanner />
            <div className="ingen-tilgang-bakgrunn">
                <Alerts />

                <Heading size="large" level="1">
                    Du mangler tilganger som arbeidsgiver
                </Heading>

                <span className="ingen-tilgang-container">
                    <LenkepanelMedLogging
                        loggLenketekst="Se tjenester som privatperson"
                        href={lenkeTilDittNavPerson}
                    >
                        <LinkPanel.Title>Se tjenester som privatperson</LinkPanel.Title>
                        <LinkPanel.Description>Gå til din innloggede side</LinkPanel.Description>
                    </LenkepanelMedLogging>

                    <LenkepanelMedLogging
                        loggLenketekst="Hvordan får jeg tilgang?"
                        href={infoOmTilgangsstyringURL}
                    >
                        <LinkPanel.Title>Hvordan får jeg tilgang?</LinkPanel.Title>
                        <LinkPanel.Description>
                            Lær om roller og tilganger i Altinn
                        </LinkPanel.Description>
                    </LenkepanelMedLogging>
                </span>
            </div>
        </>
    );
};
