import fetchMock from 'fetch-mock';
import { pamSettBedriftURL, pamHentStillingsannonserURL } from '../lenker';
import { delayed, randomInt } from '../utils/util';

export const mock = () => {
    fetchMock
        .get('/min-side-arbeidsgiver/abtest',
            (url, request) => {
                return delayed(1000, () => false);
            },
        )
        .spy();
}