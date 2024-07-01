import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

const dagligLederUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () => {
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: [
            {
                Name: faker.company.name(),
                Type: 'Enterprise',
                OrganizationNumber: '121488424',
                OrganizationForm: 'AS',
                Status: 'Active',
            },
            {
                Name: faker.company.name(),
                Type: 'Business',
                OrganizationNumber: '999999999',
                ParentOrganizationNumber: '121488424',
                OrganizationForm: 'BEDR',
                Status: 'Active',
            },
        ],
        tilganger: [
            {
                id: 'inntektsmelding',
                tjenestekode: '4936',
                tjenesteversjon: '1',
                organisasjoner: ['121488424', '999999999'],
            },
        ],
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: [],
    });
});

export const dagligLederScenario = [dagligLederUserInfoScenario];
