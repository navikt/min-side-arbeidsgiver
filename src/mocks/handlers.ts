import { storageHandlers } from './handlers/storageHandler';
import { kontaktinfoHandler } from './handlers/kontaktinfoHandler';
import { http, HttpResponse } from 'msw';
import { orgnr } from './brukerApi/helpers';
import { faker } from '@faker-js/faker';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver,
    hentSakerResolver,
    sakstyperResolver,
    hentSakByIdResolver,
} from './brukerApi/resolvers';
import { kontonummerHandlers } from './handlers/kontonummerHandler';

/**
 * generelle handlers som har lik oppførsel uavhengig av profil.
 */
export const handlers = [
    // varslingStatusHandler
    http.post('/min-side-arbeidsgiver/api/varslingStatus/v1', () =>
        HttpResponse.json({
            status: 'OK',
            varselTimestamp: '2021-01-01T00:00:00',
            kvittertEventTimestamp: '2021-01-04T00:00:00Z',
        })
    ),

    // altinnTilgangsoknadHandler
    http.get('/min-side-arbeidsgiver/api/altinn-tilgangssoknad', () =>
        HttpResponse.json([
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5278',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Created',
                submitUrl: 'https://fake-altinn/send-inn-soknad/',
                serviceCode: '5332',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: '/mock-altinn/skjema/',
                serviceCode: '5516',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
            {
                orgnr: '321988123',
                status: 'Unopened',
                submitUrl: '/mock-altinn/skjema/',
                serviceCode: '5216',
                serviceEdition: 1,
                createdDateTime: '',
                lastChangedDateTime: '',
            },
        ])
    ),

    // eregHandlers
    http.get(
        '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/:orgnr',
        ({ params }) => {
            const parentOrgnummer = orgnr();
            const orgNr = params.orgnr;
            return HttpResponse.json({
                organisasjonsnummer: params.orgnr,
                navn: faker.company.name(),
                organisasjonsform: {
                    kode: 'BEDR',
                    beskrivelse: 'Bedrift',
                    _links: {
                        self: {
                            href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/organisasjonsformer/BEDR',
                        },
                    },
                },
                postadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '1358',
                    poststed: 'JAR',
                    adresse: [faker.location.streetAddress()],
                    kommune: 'BÆRUM',
                    kommunenummer: '3024',
                },
                registreringsdatoEnhetsregisteret: '2010-12-15',
                registrertIMvaregisteret: false,
                naeringskode1: {
                    beskrivelse: 'Administrasjon av finansmarkeder',
                    kode: '66.110',
                },
                antallAnsatte: 42,
                overordnetEnhet: orgnr(),
                oppstartsdato: '2010-12-15',
                datoEierskifte: '2010-12-15',
                beliggenhetsadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '7950',
                    poststed: 'ABELVÆR',
                    adresse: [faker.location.streetAddress()],
                    kommune: 'NÆRØYSUND',
                    kommunenummer: '5060',
                },
                _links: {
                    self: {
                        href:
                            '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/' +
                            orgNr,
                    },
                    overordnetEnhet: {
                        href:
                            '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/' +
                            parentOrgnummer,
                    },
                },
            });
        }
    ),

    http.get(
        '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/:orgnr',
        ({ params }) =>
            HttpResponse.json({
                organisasjonsnummer: params.orgnr,
                navn: 'Presentabel Bygning',
                organisasjonsform: {
                    kode: 'AS',
                    beskrivelse: 'Aksjeselskap',
                    _links: {
                        self: {
                            href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/organisasjonsformer/AS',
                        },
                    },
                },
                hjemmeside: 'foo.bar.baz',
                postadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '2652',
                    poststed: 'SVINGVOLL',
                    adresse: ['Sørskei-Tjernet 7'],
                    kommune: 'GAUSDAL',
                    kommunenummer: '3441',
                },
                registreringsdatoEnhetsregisteret: '2004-12-15',
                registrertIMvaregisteret: false,
                naeringskode1: {
                    beskrivelse: 'Administrasjon av finansmarkeder',
                    kode: '66.110',
                },
                antallAnsatte: 0,
                forretningsadresse: {
                    land: 'Norge',
                    landkode: 'NO',
                    postnummer: '7950',
                    poststed: 'ABELVÆR',
                    adresse: ['Niels Brandtzægs veg 22'],
                    kommune: 'NÆRØYSUND',
                    kommunenummer: '5060',
                },
                institusjonellSektorkode: {
                    kode: '3200',
                    beskrivelse: 'Banker',
                },
                registrertIForetaksregisteret: false,
                registrertIStiftelsesregisteret: false,
                registrertIFrivillighetsregisteret: false,
                konkurs: false,
                underAvvikling: false,
                underTvangsavviklingEllerTvangsopplosning: false,
                maalform: 'Bokmål',
                _links: {
                    self: {
                        href: '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/enheter/181488484',
                    },
                },
            })
    ),

    // sykefravaerstatistikkHandler
    http.get('/min-side-arbeidsgiver/api/sykefravaerstatistikk/:orgnr', () =>
        HttpResponse.json(
            Math.random() > 0.5
                ? {
                      type: 'BRANSJE',
                      label: 'Barnehager',
                      prosent: 15.8,
                  }
                : {
                      type: 'VIRKSOMHET',
                      label: 'MAURA OG KOLBU REGNSKAP',
                      prosent: 10.4,
                  }
        )
    ),

    ...kontonummerHandlers,
    ...storageHandlers,

    kontaktinfoHandler,

    // brukerApi default tomme data, setter per scenario
    hentSakerResolver([]),
    hentKalenderavtalerResolver([]),
    hentNotifikasjonerResolver([]),
    sakstyperResolver([]),
    hentSakByIdResolver([])
];
