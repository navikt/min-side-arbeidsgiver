import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../faker/brukerApiHelpers';

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () => {
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: [...Array(100).keys()].flatMap(() => {
            let parent = orgnr();
            return [
                {
                    Name: faker.company.name(),
                    Type: 'Enterprise',
                    OrganizationNumber: parent,
                    OrganizationForm: 'AS',
                    Status: 'Active',
                },
                {
                    Name: faker.company.name(),
                    Type: 'Business',
                    OrganizationNumber: orgnr(),
                    ParentOrganizationNumber: parent,
                    OrganizationForm: 'BEDR',
                    Status: 'Active',
                },
            ];
        }),
        tilganger: [],
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: [],
    });
});

export const regnskapsforerScenario = [regnskapsforerUserInfoScenario];
