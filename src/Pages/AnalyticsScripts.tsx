import { awaitDecoratorData, getCurrentConsent } from '@navikt/nav-dekoratoren-moduler';
import { useEffect, useState } from 'react';
import environment from '../utils/environment';

interface Consent {
    analytics: boolean;
    surveys: boolean;
}

const getConsent = async (): Promise<Consent | null> => {
    try {
        await awaitDecoratorData();
        const { consent } = getCurrentConsent();
        return consent;
    } catch (error) {
        console.error('Failed to retrieve consent:', error);
        return null;
    }
};

export const AnalyticsScripts = () => {
    const trackingId = environment.VITE_UMAMI_TRACKING_ID;
    const [userConsent, setUserConsent] = useState<Consent | null>(null);

    useEffect(() => {
        getConsent().then(setUserConsent);
    }, []);

    if (!userConsent || !userConsent.analytics) return null;

    return (
        <script
            defer
            src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id={trackingId}
            data-auto-track={false}
        />
    );
};