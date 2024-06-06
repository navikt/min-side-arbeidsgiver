import { http, HttpResponse } from 'msw';

export const nærmesteLederBrukerApiScenario = http.get(
    '/min-side-arbeidsgiver/api/userInfo/v1',
    () => {
        return HttpResponse.json({
            altinnError: false,
            organisasjoner: [
                {
                    Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                    Type: 'Enterprise',
                    OrganizationNumber: '121488424',
                    OrganizationForm: 'AS',
                    Status: 'Active',
                },
                {
                    Name: 'SALTRØD OG HØNEBY',
                    Type: 'Business',
                    OrganizationNumber: '999999999',
                    ParentOrganizationNumber: '121488424',
                    OrganizationForm: 'BEDR',
                    Status: 'Active',
                },
            ],
            tilganger: [],
            digisyfoError: false,
            digisyfoOrganisasjoner: [
                {
                    organisasjon: {
                        Name: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                        Type: 'Enterprise',
                        OrganizationNumber: '121488424',
                        OrganizationForm: 'AS',
                        Status: 'Active',
                    },
                    antallSykmeldte: 4,
                },
                {
                    organisasjon: {
                        Name: 'SALTRØD OG HØNEBY',
                        Type: 'Business',
                        OrganizationNumber: '999999999',
                        ParentOrganizationNumber: '121488424',
                        OrganizationForm: 'BEDR',
                        Status: 'Active',
                    },
                    antallSykmeldte: 4,
                },
            ],
            refusjoner: [],
        });
    }
);
