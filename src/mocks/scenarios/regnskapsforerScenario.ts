import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import { Merkelapp } from '../brukerApi/alleMerkelapper';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { nærmesteLederOrganisasjon } from './nærmesteLederScenario';
import { navtjenester } from '../../altinn/tjenester';

const tilganger = [
    'nav_foreldrepenger_inntektsmelding',
    'nav_sykepenger_inntektsmelding',
    'nav_sykepenger_fritak-arbeidsgiverperiode',
    'nav_sykdom-i-familien_inntektsmelding',
    'nav_yrkesskade_skademelding',
    'nav_tiltak_ekspertbistand',
    'nav_medlemskap-lovvalg_soknad',
];

export const regnskapsforerOrganisasjoner = Array.from({ length: 100 }).map(() => ({
    orgnr: orgnr(),
    navn: faker.company.name(),
    organisasjonsform: 'AS',
    roller: ['REGNA'],
    underenheter: Array.from({
        length: faker.number.int({ min: 0, max: 5 }),
    }).map(() => ({
        orgnr: orgnr(),
        roller: [],
        underenheter: [],
        navn: faker.company.name(),
        organisasjonsform: 'BEDR',
    })),
}));

const alleUnderenheter = regnskapsforerOrganisasjoner.flatMap((org) => org.underenheter);

const regnskapsforerUserInfoScenario = http.get('/min-side-arbeidsgiver/api/userInfo/v3', () => {
    return HttpResponse.json({
        altinnError: false,
        organisasjoner: regnskapsforerOrganisasjoner,
        tilganger: fromEntries(
            tilganger.map((tilgang) => [tilgang, alleUnderenheter.map((org) => org.orgnr)])
        ),
        digisyfoError: false,
        digisyfoOrganisasjoner: [],
        refusjoner: alleUnderenheter.map(({ orgnr }) => ({
            virksomhetsnummer: orgnr,
            statusoversikt: { KLAR_FOR_INNSENDING: faker.number.int({ min: 0, max: 10 }) },
            tilgang: true,
        })),
    });
});

const regnskapsførerSakstyper = [
    //Merkelapp.Fritak_i_arbeidsgiverperioden,
    Merkelapp.Inntektsmelding,
    Merkelapp.Inntektsmelding_sykepenger,
    Merkelapp.Inntektsmelding_pleiepenger_sykt_barn,
    //Merkelapp.Lønnstilskudd,
    //Merkelapp.Masseoppsigelse,
    //Merkelapp.Permittering,
    //Merkelapp.Sommerjobb,
    //Merkelapp.Yrkesskade,
];

// Demo-rader for hver Delegation-request-state. Hver underenhet får én rad per tjeneste,
// og statusene sykles slik at alle UI-tilstandene vises side-om-side på samme virksomhet.
const delegationStatuses = ['None', 'Draft', 'Pending', 'Approved', 'Rejected', 'Withdrawn'] as const;
const demoStates = Object.values(navtjenester).map((tjeneste, i) => ({
    resourceReferenceId: tjeneste.ressurs,
    status: delegationStatuses[i % delegationStatuses.length],
    detailsLink:
        delegationStatuses[i % delegationStatuses.length] === 'Draft' && i === 1
            ? 'https://altinn.no/ui/delegation-request/demo-draft-link'
            : null,
}));

const delegationRequestsScenario = http.get('/min-side-arbeidsgiver/api/delegation-request', () => {
    const now = new Date().toISOString();
    const rows = alleUnderenheter.flatMap((u) =>
        demoStates.map((s) => ({
            id: faker.string.uuid(),
            orgnr: u.orgnr,
            resourceReferenceId: s.resourceReferenceId,
            status: s.status,
            detailsLink: s.detailsLink,
            opprettet: now,
            sistOppdatert: now,
        }))
    );
    return HttpResponse.json(rows);
});

export const regnskapsforerScenario = [
    regnskapsforerUserInfoScenario,
    delegationRequestsScenario,

    ...brukerApiHandlers([nærmesteLederOrganisasjon], (merkelapp) =>
        regnskapsførerSakstyper.includes(merkelapp)
    ),
];
