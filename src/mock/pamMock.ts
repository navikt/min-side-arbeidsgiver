import fetchMock from 'fetch-mock';
import { pamSettBedriftLenke, pamHentStillingsannonserLenke } from '../lenker';

export const mock = () => {
    fetchMock.get(pamSettBedriftLenke('811076422'), 200);
    fetchMock.get(pamHentStillingsannonserLenke, {
        TIL_GODKJENNING: 17,
        GODKJENT: 0,
        PAABEGYNT: 42,
        TIL_AVSLUTTING: 0,
        AVSLUTTET: 5,
        AVVIST: 0,
        PUBLISERT: 0,
    });

    fetchMock.get('begin:' + pamSettBedriftLenke(''), 200).spy();
}