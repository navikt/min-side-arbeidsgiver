import fetchMock from 'fetch-mock';
import { digiSyfoNarmesteLederLink, digisyfoSykemeldteLenke } from '../lenker';

const delay = new Promise(res => setTimeout(res, 1500));

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

fetchMock
    .get(digisyfoSykemeldteLenke(), [
        {
            fnr: '',
            aktoerId: '1397174971178',
            orgnummer: '910532308',
            koblingId: 30968,
            navn: null,
        },
        {
            fnr: '',
            aktoerId: '1563540214911',
            orgnummer: '910532251',
            koblingId: 30969,
            navn: null,
        },
        {
            fnr: '',
            aktoerId: '1113726300051',
            orgnummer: '910532308',
            koblingId: 30801,
            navn: null,
        },
    ])
    .spy();

fetchMock
    .get('/min-side-arbeidsgiver/api/syfooppgaver', [
        {
            oppgaveUuid: '234212',
            ident: '12345645613',
            opprettetDato: '2019-02-07T13:51:02',
            oppgavetype: 'Sykemelding',
            ressursId: '12355321,',
            ressurseier: '123521',
        },
        {
            oppgaveUuid: '334212',
            ident: '3225645613',
            opprettetDato: '2019-02-07T13:51:02',
            oppgavetype: 'Sykepengesøknad',
            ressursId: '12355321,',
            ressurseier: '123521',
        },
    ])
    .spy();
