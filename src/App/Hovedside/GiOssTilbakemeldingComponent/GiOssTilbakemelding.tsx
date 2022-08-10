import React, { useContext, useEffect } from 'react';
import * as Record from '../../../utils/Record';
import './GiOssTilbakemelding.less';
import { OrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerProvider';
import { gittMiljo } from '../../../utils/environment';

export const GiOssTilbakemelding = () => {
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    const harInntektsmeldingPåTvers = Record
        .values(organisasjoner)
        .some(org => org.altinntilgang.inntektsmelding);

    if (harInntektsmeldingPåTvers) {
        return <UXSignals />
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
        data-uxsignals-embed="study-txkx5lqsqk"
        {...(gittMiljo({
            prod: {},
            other: {
                "data-uxsignals-mode": "demo"
            },
        }))}
    />
};

