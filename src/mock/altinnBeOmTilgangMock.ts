import fetchMock from 'fetch-mock';
import { AltinnTilgangssøknad } from '../altinn/tilganger';
import { altinntjeneste } from '../altinn/tjenester';

const søknader: AltinnTilgangssøknad[] = [
    {
        orgnr: '810993502',
        status: 'Created',
        submitUrl: `https://fake-altinn/send-inn-soknad/`,
        serviceCode: altinntjeneste.arbeidstrening.tjenestekode,
        serviceEdition: altinntjeneste.arbeidstrening.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: `/mock-altinn/skjema/`,
        serviceCode: altinntjeneste.midlertidigLønnstilskudd.tjenestekode,
        serviceEdition: altinntjeneste.midlertidigLønnstilskudd.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: `/mock-altinn/skjema/`,
        serviceCode: altinntjeneste.mentortilskudd.tjenestekode,
        serviceEdition: altinntjeneste.mentortilskudd.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    }
]

export const mock = () => {
    fetchMock.get('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', () => søknader);
}