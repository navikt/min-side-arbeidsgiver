import fetchMock from 'fetch-mock';
import { delayed, randomInt } from '../utils/util';

export const mock = () => {
    fetchMock
        .get('/min-side-arbeidsgiver/api/sykefravaer'      ,
            (url, request) => {

                return delayed(1000, () => (
                    {
                        "type":"BRANSJE",
                        "label":"Barnehager",
                        "prosent":15.8
                    }
                ));
            },
        )
        .spy();
};