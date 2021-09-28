import amplitude from 'amplitude-js';
import { gittMiljo } from './environment';

const getApiKey = () => {
    return window.location.hostname === 'arbeidsgiver.nav.no'
        ? '3a6fe32c3457e77ce81c356bb14ca886'
        : '55477baea93c5227d8c0f6b813653615';
};

const createAmpltiudeInstance = () => {
    const instance = amplitude.getInstance();

    instance.init(getApiKey(), '', {
        apiEndpoint: 'amplitude.nav.no/collect',
        saveEvents: false,
        includeUtm: true,
        batchEvents: false,
        includeReferrer: true
    });

    return instance;
}


export default gittMiljo({
    prod: () => createAmpltiudeInstance(),
    dev: () => createAmpltiudeInstance(),
    other: () => ({
        logEvent: (event: string, data?: any) => {
            console.log(`${event}: ${JSON.stringify(data)}`, {event, data})
        },
        setUserProperties:(userProps:object) => {
            console.log(`set userprops: ${JSON.stringify(userProps)}`)
        }
    } as amplitude.AmplitudeClient )
})();
