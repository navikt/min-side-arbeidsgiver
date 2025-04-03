import { useConsent } from './ConsentContext';
import environment from '../utils/environment';

export const AnalyticsScripts = () => {
    const trackingId = environment.VITE_UMAMI_TRACKING_ID;
    const consent = useConsent();

    if (!consent || !consent.analytics) return null;

    return (
        <script
            defer
            src="/js/sporing.js"
            data-host-url="https://umami.nav.no"
            data-website-id={trackingId}
            data-auto-track="true"
            data-global-name="minsideUmami"
        />
    );
};