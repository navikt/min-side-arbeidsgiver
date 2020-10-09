import fetchMock from 'fetch-mock';
import { AltinnTilgangssøknad } from '../altinn/tilganger';
import { alleAltinntjenster } from '../altinn/tjenester';

const søknader: AltinnTilgangssøknad[] = [
    {
        orgnr: '810993502',
        status: 'Created',
        submitUrl: `https://fake-altinn/send-inn-soknad/`,
        serviceCode: alleAltinntjenster.arbeidstrening.tjenestekode,
        serviceEdition: alleAltinntjenster.arbeidstrening.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: `/mock-altinn/skjema/`,
        serviceCode: alleAltinntjenster.midlertidigLønnstilskudd.tjenestekode,
        serviceEdition: alleAltinntjenster.midlertidigLønnstilskudd.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    },
    {
        orgnr: '810993502',
        status: 'Unopened',
        submitUrl: `/mock-altinn/skjema/`,
        serviceCode: alleAltinntjenster.mentortilskudd.tjenestekode,
        serviceEdition: alleAltinntjenster.mentortilskudd.tjenesteversjon,
        cratedDateTime: '',
        lastChangedDateTime: '',
    }
]

fetchMock.get('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', () => søknader);

// fetchMock.post('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', (url, request) => {
//     const skjema = JSON.parse(request.body?.toString() ?? '') as AltinnTilgangssøknadskjemaDTO;
//     const søknad: AltinnTilgangssøknad = {
//         orgnr: skjema.orgnr,
//         status: 'Created',
//         submitUrl: `/mock-altinn/skjema${id}/`,
//         serviceCode: skjema.serviceCode,
//         serviceEdition: skjema.serviceEdition.toString(),
//         cratedDateTime: new Date().toString(),
//         lastChangedDateTime: new Date().toString(),
//     };
//
//     søknader.push([id, søknad, skjema.redirectUrl]);
//     id += 1;
//     return søknad;
// });
