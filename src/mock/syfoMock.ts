import fetchMock from 'fetch-mock';
import { digiSyfoNarmesteLederLink } from '../lenker';

const delay = new Promise(res => setTimeout(res, 1500));

export const mock = () => {
    fetchMock
        .get(
            digiSyfoNarmesteLederLink,
            delay.then(() => {
                return {
                    tilgang: true,
                };
            })
        )
        .spy();
}
