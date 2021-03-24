import fetchMock from 'fetch-mock';
import { digiSyfoNarmesteLederURL } from '../lenker';

const delay = new Promise(res => setTimeout(res, 1500));

export const mock = () => {
    fetchMock
        .get(
            digiSyfoNarmesteLederURL,
            delay.then(() => {
                return {
                    tilgang: true,
                };
            })
        )
        .spy();
}
