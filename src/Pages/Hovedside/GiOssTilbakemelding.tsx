import React, { useContext, useEffect } from 'react';
import * as Record from '../../utils/Record';
import './GiOssTilbakemelding.css';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { gittMiljo } from '../../utils/environment';

export const GiOssTilbakemelding = () => {
    return null //disable UX-signals
}

export const GiOssTilbakemeldingDisabled = () => {
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    const harInntektsmeldingPåTvers = Record
        .values(organisasjoner)
        .some(org => org.altinntilgang.inntektsmelding);

    if (harInntektsmeldingPåTvers) {
        return <UXSignals/>;
    } else {
        return null;
    }
};

const UXSignals = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = "https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js";
        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
            }
        };
    }, []);

    return <div
        key="tilbakemelding-banner"
        className="tilbakemelding-banner"
        data-uxsignals-embed="study-yoz8qmkdor"
        {...(gittMiljo({
            prod: {},
            other: {
                "data-uxsignals-mode": "demo"
            },
        }))}
    />
};

