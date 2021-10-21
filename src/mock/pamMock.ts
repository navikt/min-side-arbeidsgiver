import fetchMock from 'fetch-mock';
import { pamSettBedriftURL, pamHentStillingsannonserURL } from '../lenker';

export const mock = () => {
    fetchMock.get(pamSettBedriftURL('811076422'), 200);
    fetchMock.get(pamHentStillingsannonserURL, {
        TIL_GODKJENNING: 17,
        GODKJENT: 0,
        PAABEGYNT: 42,
        TIL_AVSLUTTING: 0,
        AVSLUTTET: 5,
        AVVIST: 0,
        PUBLISERT: 5,
    });

    fetchMock.get('begin:' + pamSettBedriftURL(''), 200);
}