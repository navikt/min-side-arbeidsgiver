import fetchMock from 'fetch-mock';
import { digiSyfoNarmesteLederURL } from '../lenker';

export const mock = () => {
    fetchMock.get(digiSyfoNarmesteLederURL, { tilgang: true });
}
