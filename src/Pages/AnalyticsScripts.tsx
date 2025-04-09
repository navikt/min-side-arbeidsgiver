import { useConsent } from './ConsentContext';
import environment from '../utils/environment';
import { useEffect } from 'react';

export const AnalyticsScripts = () => {
    const trackingId = environment.VITE_UMAMI_TRACKING_ID;
    const consent = useConsent();

    useEffect(() => {
        if (trackingId !== undefined && consent && consent.analytics) {
            const script = document.createElement('script');
            script.defer = true;
            script.src = 'js/sporing.js';
            script.dataset.hostUrl = 'https://umami.nav.no';
            script.dataset.websiteId = trackingId;
            script.dataset.autoTrack = 'true';
            script.dataset.globalName = 'minsideUmami';

            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [consent, trackingId]);

    return null;
};