import fetchMock from 'fetch-mock';
import { Varsel, Varseltype } from '../api/varslerApi';
const delay = new Promise((res) => setTimeout(res, 500));

fetchMock
    .get(
        'min-side-arbeidsgiver/api/varsler',
        delay.then(() => {
            return VarslerResponse;
        })
    )
    .spy();

let date1 = new Date();
date1.setHours(date1.getHours() - 1);

let date2 = new Date();
date2.setHours(date2.getHours() - 24);

let date3 = new Date();
date3.setHours(date3.getHours() - 48);

let date4 = new Date();
date4.setHours(date3.getHours() - 72);

let date5 = new Date();
date5.setHours(date3.getHours() - 98);

const VarslerResponse: Varsel[] = [
    {
        dato: date1,
        type: 'ARBEIDSPLASSEN',
        beskjed: '4 nye kandidater lagt til i listen “Frontdesk medarbeider”',
        varseltype: Varseltype.BESKJED,
        href: '',
    },
    {
        dato: date2,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.OPPGAVE,
        href: '',
    },
    {
        dato: date3,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.OPPGAVE,
        href: '',
    },
    {
        dato: date4,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.BESKJED,
        href: '',
    },
    {
        dato: date5,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.OPPGAVE,
        href: '',
    },
];
