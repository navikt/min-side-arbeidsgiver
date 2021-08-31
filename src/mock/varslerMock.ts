import fetchMock from 'fetch-mock';

export const mock = () => {
    fetchMock.config.fallbackToNetwork = true;
    fetchMock.config.warnOnFallback = false;
}
