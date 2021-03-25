import fetchMock from 'fetch-mock';
export const helloWorld = "helllo world";

// fetchMock
//     .post(
//         'https://bruker-api.notifikasjon-ag.dev.nav.no/api/graphql',
//
//     )
//     .spy()
// import { Varsel, Varseltype } from '../api/varslerApi';
// const delay = new Promise((res) => setTimeout(res, 500));
//
// fetchMock
//     .get(
//         'min-side-arbeidsgiver/api/varsler',
//         delay.then(() => {
//             return VarslerResponse;
//         })
//     )
//     .spy();
//
// fetchMock
//     .post(
//         'begin:/min-side-arbeidsgiver/api/varsler/harsettvarsler/',
//         delay.then(() => {
//             return ({ body }: any) => body;
//         })
//     )
//     .spy();
//
// fetchMock
//     .post(
//         'begin:/min-side-arbeidsgiver/api/varsler/erlest/',
//         delay.then(() => {
//             return ({ body }: any) => body;
//         })
//     )
//     .spy();
//
// let date1 = new Date();
// date1.setHours(date1.getHours() - 1);
//
// let date2 = new Date();
// date2.setHours(date2.getHours() - 24);
//
// let date3 = new Date();
// date3.setHours(date3.getHours() - 48);
//
// let date4 = new Date();
// date4.setHours(date4.getHours() - 72);
//
// let date5 = new Date();
// date5.setHours(date5.getHours() - 98);
//
// let date6 = new Date();
// date6.setHours(date6.getHours() - 122);
//
// let date7 = new Date();
// date7.setHours(date7.getHours() - 146);
//
// let date8 = new Date();
// date8.setHours(date8.getHours() - 170);
//
// const VarslerResponseTom: Varsel[] = [];
//
// const VarslerResponse: Varsel[] = [
//     {
//         id: '1',
//         dato: date6,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: false,
//     },
//     {
//         id: '2',
//         dato: date7,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: false,
//     },
//     {
//         id: '3',
//         dato: date8,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: true,
//     },
//     {
//         id: '4',
//         dato: date1,
//         type: 'ARBEIDSPLASSEN',
//         beskjed: '4 nye kandidater lagt til i listen “Frontdesk medarbeider”',
//         varseltype: Varseltype.BESKJED,
//         href: '',
//         lest: true,
//     },
//     {
//         id: '5',
//         dato: date2,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: false,
//     },
//     {
//         id: '6',
//         dato: date3,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: true,
//     },
//     {
//         id: '7',
//         dato: date4,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.BESKJED,
//         href: '',
//         lest: false,
//     },
//     {
//         id: '8',
//         dato: date5,
//         type: 'DINE SYKMELDTE',
//         beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
//         varseltype: Varseltype.OPPGAVE,
//         href: '',
//         lest: false,
//     },
// ];
