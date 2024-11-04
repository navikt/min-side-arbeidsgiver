import * as amplitude from '@amplitude/analytics-browser';
import { Types } from '@amplitude/analytics-browser';
import { gittMiljo } from './environment';

const getApiKey = () => {
    return window.location.hostname === 'arbeidsgiver.nav.no'
        ? 'a8243d37808422b4c768d31c88a22ef4'
        : '6ed1f00aabc6ced4fd6fcb7fcdc01b30';
};

type AmplitudeInstance = Pick<Types.BrowserClient, 'logEvent' | 'identify'>;
const createAmpltiudeInstance = (): AmplitudeInstance => {
    amplitude
        .init(getApiKey(), undefined, {
            serverUrl: 'https://amplitude.nav.no/collect',
            useBatch: false,
        })
        .promise.catch((error) => {
            console.error('#MSA error initializing amplitude', error);
        });
    return amplitude;
};

const mockedAmplitude = (): AmplitudeInstance => ({
    logEvent: (eventInput: Types.BaseEvent | string, eventProperties?: Record<string, any>) => {
        console.group('Mocked amplitude-event');
        console.table({ eventInput, ...eventProperties });
        console.groupEnd();
        return {
            promise: new Promise<Types.Result>((resolve) =>
                resolve({
                    event: { event_type: 'MockEvent' },
                    code: 200,
                    message: 'Success: mocked amplitude-tracking',
                })
            ),
        };
    },
    identify(
        identify: Types.Identify,
        _?: Types.EventOptions
    ): Types.AmplitudeReturn<Types.Result> {
        console.group('Mocked amplitude-identify');
        console.table(identify);
        console.groupEnd();
        return {
            promise: new Promise<Types.Result>((resolve) =>
                resolve({
                    event: { event_type: 'MockIdentify' },
                    code: 200,
                    message: 'Success: mocked amplitude-identify',
                })
            ),
        };
    },
});

export default gittMiljo({
    prod: () => createAmpltiudeInstance(),
    dev: () => createAmpltiudeInstance(),
    other: () => mockedAmplitude(),
})();
