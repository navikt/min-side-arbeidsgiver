import amplitude from 'amplitude-js';
import { gittMiljo } from './environment';

const getApiKey = () => {
    return window.location.hostname === 'arbeidsgiver.nav.no'
        ? 'a8243d37808422b4c768d31c88a22ef4'
        : '6ed1f00aabc6ced4fd6fcb7fcdc01b30';
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
