import { awaitDecoratorData, getCurrentConsent } from '@navikt/nav-dekoratoren-moduler';

let cachedConsent: Consent | null = null;

interface Consent {
    analytics: boolean;
    surveys: boolean;
}

export const getConsent = async (): Promise<Consent | null> => {
    if (cachedConsent !== null) {
        return cachedConsent;
    }

    try {
        await awaitDecoratorData();
        const { consent } = getCurrentConsent();
        cachedConsent = consent;
        return consent;
    } catch (error) {
        console.error('Failed to retrieve consent:', error);
        return null;
    }
};