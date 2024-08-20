import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { alleTilganger, orgnr } from '../faker/brukerApiHelpers';

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () => {
    const organisasjoner = [...Array(100).keys()].flatMap(() => {
        let hovedenhet = orgnr();
        return [
            {
                Name: faker.company.name(),
                Type: 'Enterprise',
                OrganizationNumber: hovedenhet,
                OrganizationForm: 'AS',
                Status: 'Active',
            },
            {
                Name: faker.company.name(),
                Type: 'Business',
                OrganizationNumber: orgnr(),
                ParentOrganizationNumber: hovedenhet,
                OrganizationForm: 'BEDR',
                Status: 'Active',
            },
            {
                Name: faker.company.name(),
                Type: 'Business',
                OrganizationNumber: orgnr(),
                ParentOrganizationNumber: hovedenhet,
                OrganizationForm: 'BEDR',
                Status: 'Active',
            },
        ];
    });
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: organisasjoner,
        tilganger: alleTilganger.map(({ id, tjenestekode, tjenesteversjon }) => ({
            id,
            tjenestekode,
            tjenesteversjon,
            organisasjoner: organisasjoner.map((org) => org.OrganizationNumber),
        })),
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: [],
    });
});

export const regnskapsforerScenario = [regnskapsforerUserInfoScenario];
