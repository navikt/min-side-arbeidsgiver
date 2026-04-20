import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { orgnr } from '../brukerApi/helpers';
import { fromEntries } from '../../utils/Record';
import { Merkelapp } from '../brukerApi/alleMerkelapper';
import { brukerApiHandlers } from '../brukerApi/resolvers';
import { nærmesteLederOrganisasjon } from './nærmesteLederScenario';

const tilganger = [
    'nav_foreldrepenger_inntektsmelding',
    'nav_sykepenger_inntektsmelding',
    'nav_sykepenger_fritak-arbeidsgiverperiode',
    'nav_sykdom-i-familien_inntektsmelding',
    'nav_yrkesskade_skademelding',
    'nav_tiltak_ekspertbistand',
    '4826:1', // utsendtArbeidstakerEØS
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

// Demo-rader for hver Delegation-request-state. Hver underenhet får én rad for hver status,
// slik at alle UI-tilstandene vises side-om-side på samme virksomhet.
const demoStates: Array<{
    resourceReferenceId: string;
    status: 'None' | 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
    detailsLink: string | null;
}> = [
    {
        resourceReferenceId: 'nav_permittering-og-nedbemmaning_innsyn-i-alle-innsendte-meldinger',
        status: 'Pending',
        detailsLink: null,
    },
    {
        resourceReferenceId: 'nav_arbeidsforhold_aa-registeret-innsyn-arbeidsgiver',
        status: 'Approved',
        detailsLink: null,
    },
    {
        resourceReferenceId: 'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk',
        status: 'Draft',
        detailsLink: 'https://altinn.no/ui/delegation-request/demo-draft-link',
    },
    {
        resourceReferenceId: 'nav_rekruttering_kandidater',
        status: 'Draft',
        detailsLink: null,
    },
    {
        resourceReferenceId: 'nav_rekruttering_stillingsannonser',
        status: 'Rejected',
        detailsLink: null,
    },
    {
        resourceReferenceId: 'nav_tiltak_tiltaksrefusjon',
        status: 'Withdrawn',
        detailsLink: null,
    },
];

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
