import { graphql, http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { alleTilganger, oppgaveTilstandInfo, orgnr } from '../faker/brukerApiHelpers';
import { graphql as executeGraphQL } from 'graphql/graphql';
import { saker, schema } from '../handlers/brukerApiHandler';

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v1', () => {
    const organisasjoner = [...Array(100).keys()].flatMap(() => {
        let hovedenhet = orgnr();
        return [
            {
                Name: faker.company.name(),
                OrganizationNumber: hovedenhet,
                OrganizationForm: 'AS',
            },
            {
                Name: faker.company.name(),
                OrganizationNumber: orgnr(),
                ParentOrganizationNumber: hovedenhet,
                OrganizationForm: 'BEDR',
            },
            {
                Name: faker.company.name(),
                OrganizationNumber: orgnr(),
                ParentOrganizationNumber: hovedenhet,
                OrganizationForm: 'BEDR',
            },
        ];
    });
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: organisasjoner,
        tilganger: alleTilganger
            .filter(({ tjenestekode }) => {
                return !['5441', '5078', '5516', '5332'].includes(tjenestekode);
            })
            .map(({ tjenestekode, tjenesteversjon }) => ({
                tjenestekode,
                tjenesteversjon,
                organisasjoner: organisasjoner.map((org) => org.OrganizationNumber),
            })),
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: organisasjoner.map(({ OrganizationNumber }) => ({
            virksomhetsnummer: OrganizationNumber,
            statusoversikt: { KLAR_FOR_INNSENDING: faker.number.int({ min: 0, max: 10 }) },
            tilgang: true,
        })),
    });
});

const regnskapsførerSakstyper = [
    'Fritak i arbeidsgiverperioden',
    'Inntektsmelding',
    'Inntektsmelding sykepenger',
    'Inntektsmelding pleiepenger',
    'Lønnstilskudd',
    'Masseoppsigelse',
    'Permittering',
    'Sommerjobb',
    'Yrkesskade',
];

export const regnskapsforerBrukerApiScenario = [
    graphql.query('HentKalenderavtaler', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                kommendeKalenderavtaler: {
                    avtaler: [],
                    __typename: 'KalenderavtalerResultat',
                },
            },
        });

        return HttpResponse.json({ errors, data });
    }),

    graphql.query('hentSaker', async ({ query, variables }) => {
        const sakerFiltrert = saker.filter(({ merkelapp }) =>
            (variables.sakstyper ?? regnskapsførerSakstyper)?.includes(merkelapp)
        );
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                saker: {
                    saker: sakerFiltrert.length > 0 ? sakerFiltrert : saker,
                    sakstyper: regnskapsførerSakstyper.map((navn) => ({
                        navn,
                        antall: faker.number.int(100),
                    })),
                    feilAltinn: false,
                    totaltAntallSaker: faker.number.int(1000),
                    oppgaveTilstandInfo: oppgaveTilstandInfo(),
                },
            },
        });

        return HttpResponse.json({ errors, data });
    }),

    graphql.query('Sakstyper', async ({ query, variables }) => {
        const { errors, data } = await executeGraphQL({
            schema,
            source: query,
            variableValues: variables,
            rootValue: {
                sakstyper: regnskapsførerSakstyper.map((navn) => ({ navn })),
            },
        });

        return HttpResponse.json({ errors, data });
    }),
];

export const regnskapsforerScenario = [
    regnskapsforerUserInfoScenario,

    ...regnskapsforerBrukerApiScenario,
];
