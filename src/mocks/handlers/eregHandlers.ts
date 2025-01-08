import { http, HttpResponse } from 'msw';
import { orgnr } from '../brukerApi/helpers';
import { faker } from '@faker-js/faker';
import { Demoprofil } from '../../hooks/useDemoprofil';
import { dagligLederOrganisasjon } from '../scenarios/dagligLederScenario';
import { nærmesteLederOrganisasjon } from '../scenarios/nærmesteLederScenario';
import { regnskapsforerOrganisasjoner } from '../scenarios/regnskapsforerScenario';

type organisasjon = {
    orgnr: string;
    navn: string;
    organisasjonsform: string;
    underenheter: organisasjon[];
};

const organisasjoner: {
    [key: Demoprofil]: organisasjon[];
} = {
    DagligLeder: [dagligLederOrganisasjon],
    NarmesteLeder: [nærmesteLederOrganisasjon],
    Regnskapsforer: regnskapsforerOrganisasjoner,
};

const parentOrgnr = (demoprofil: Demoprofil, underenhetOrgnr: string | readonly string[]) => {
    const org = organisasjoner[demoprofil].find((o) => o.underenheter.some((u) => u.orgnr === underenhetOrgnr));
    if (!org) {
        throw new Error(`Fant ikke organisasjon med orgnr ${orgnr}`);
    }
    return org.orgnr;
}

export const eregHandlers = (demoprofil: Demoprofil) => [
    http.get(
        '/min-side-arbeidsgiver/mock/data.brreg.no/enhetsregisteret/api/underenheter/:orgnr',
        ({ params }) => {
            const parentOrgnummer = parentOrgnr(demoprofil, params.orgnr);
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
                overordnetEnhet: parentOrgnummer,
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
];
