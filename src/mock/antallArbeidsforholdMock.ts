import fetchMock from 'fetch-mock';
import { delayed, randomInt } from '../utils/util';

export const mock = () => {
    fetchMock
        .get('/min-side-arbeidsgiver/api/antall-arbeidsforhold',
            (url, request) => {
                const antall = 502;
                const missing = randomInt(10) === 0;
                return delayed(1000, () => ({ first: '910825518', second: missing ? -1 : antall }));
            },
        )
        .spy();
};