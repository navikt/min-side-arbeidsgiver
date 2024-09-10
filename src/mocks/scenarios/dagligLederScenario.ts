import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { alleTilganger, orgnr } from '../faker/brukerApiHelpers';

const dagligLederUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () => {
    let parent1 = orgnr();
    let parent2 = orgnr();
    const organisasjoner = [
        {
            Name: faker.company.name(),
            OrganizationNumber: parent1,
            OrganizationForm: 'AS',
        },
        {
            Name: faker.company.name(),
            OrganizationNumber: orgnr(),
            ParentOrganizationNumber: parent1,
            OrganizationForm: 'BEDR',
        },
        {
            Name: faker.company.name(),
            OrganizationNumber: parent2,
            OrganizationForm: 'AS',
        },
        {
            Name: faker.company.name(),
            OrganizationNumber: orgnr(),
            ParentOrganizationNumber: parent2,
            OrganizationForm: 'BEDR',
        },
        {
            Name: faker.company.name(),
            OrganizationNumber: orgnr(),
            ParentOrganizationNumber: parent2,
            OrganizationForm: 'BEDR',
        },
    ];
    return HttpResponse.json({
        altinnError: false,
        organisasjoner,
        tilganger: alleTilganger.map(({ id, tjenestekode, tjenesteversjon }) => ({
            id,
            tjenestekode,
            tjenesteversjon,
            organisasjoner: organisasjoner.map((org) => org.OrganizationNumber),
        })),
        digisyfoError: false,
        digisyfoOrganisasjoner: organisasjoner.map((organisasjon) => ({
            organisasjon,
            antallSykmeldte: 4,
        })),
        refusjoner: organisasjoner.map(({ OrganizationNumber }) => ({
            virksomhetsnummer: OrganizationNumber,
            statusoversikt: { KLAR_FOR_INNSENDING: faker.number.int({ min: 0, max: 10 }) },
            tilgang: true,
        })),
    });
});

export const dagligLederScenario = [dagligLederUserInfoScenario];
