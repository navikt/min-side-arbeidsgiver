import React, { FC, ReactNode, useEffect } from 'react';
import { act, findByTestId, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Hovedside from '../Pages/Hovedside/Hovedside';
import { SWRConfig } from 'swr';
import { AlertsProvider } from '../Pages/Alerts';
import { useOrganisasjonerOgTilgangerContext } from '../Pages/OrganisasjonerOgTilgangerContext';
import { OrganisasjonsDetaljerProvider } from '../Pages/OrganisasjonsDetaljerProvider';
import { NotifikasjonWidgetProvider } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { MemoryRouter } from 'react-router-dom';
import { useOrganisasjonsDetaljerContext } from '../Pages/OrganisasjonsDetaljerContext';
import { OrganisasjonerOgTilgangerProvider } from '../Pages/OrganisasjonerOgTilgangerProvider';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { orgnr } from '../mocks/brukerApi/helpers';
import { faker } from '@faker-js/faker';
import {
    hentKalenderavtalerResolver,
    hentNotifikasjonerResolver, hentNotifikasjonerSistLest,
    hentSakByIdResolver,
    hentSakerResolver,
    sakstyperResolver, setNotifikasjonerSistLest,
} from '../mocks/brukerApi/resolvers';
import { alleSaker } from '../mocks/brukerApi/alleSaker';
import { Merkelapp } from '../mocks/brukerApi/alleMerkelapper';
import { alleKalenderavtaler } from '../mocks/brukerApi/alleKalenderavtaler';
import { alleNotifikasjoner } from '../mocks/brukerApi/alleNotifikasjoner';

describe('Hovedside', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('Bruker med alle tilganger får ikke a11y feil', async () => {
        vi.useFakeTimers();
        const { container } = render(
            <ComponentTestEnabler>
                <Hovedside />
            </ComponentTestEnabler>
        );

        await act(async () => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        expect(await findByTestId(container, 'valgt-organisasjon')).toBeInTheDocument();
        expect(await axe(container)).toHaveNoViolations();
    }, 10_000);
});

const MedValgtOrganisasjon: FC<{ children: ReactNode }> = ({ children }) => {
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const { valgtOrganisasjon, endreOrganisasjon } = useOrganisasjonsDetaljerContext();

    useEffect(() => {
        if (valgtOrganisasjon.organisasjon.orgnr === '182345674') return;
        endreOrganisasjon(organisasjonsInfo['182345674'].organisasjon);
    }, [valgtOrganisasjon, organisasjonsInfo]);

    return (
        <>
            <span data-testid="valgt-organisasjon">{valgtOrganisasjon.organisasjon.orgnr}</span>
            {children}
        </>
    );
};

const ComponentTestEnabler: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <MemoryRouter>
            <NotifikasjonWidgetProvider
                miljo={'local'}
                apiUrl={`${__BASE_PATH__}/notifikasjon-bruker-api`}
            >
                <SWRConfig
                    value={{
                        dedupingInterval: 0,
                        provider: () => new Map(),
                        shouldRetryOnError: (err) => {
                            // liten hack for å tvinge evt. fetch error til å bli logget
                            console.error(err);
                            return false;
                        },
                    }}
                >
                    <AlertsProvider>
                        <OrganisasjonerOgTilgangerProvider>
                            <OrganisasjonsDetaljerProvider>
                                <MedValgtOrganisasjon>{children}</MedValgtOrganisasjon>
                            </OrganisasjonsDetaljerProvider>
                        </OrganisasjonerOgTilgangerProvider>
                    </AlertsProvider>
                </SWRConfig>
            </NotifikasjonWidgetProvider>
        </MemoryRouter>
    );
};

const server = setupServer(
    http.get(`${__BASE_PATH__}/api/userInfo/v3`, () =>
        HttpResponse.json({
            altinnError: false,
            organisasjoner: [
                {
                    orgnr: orgnr(),
                    underenheter: [
                        {
                            orgnr: '182345674',
                            underenheter: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'BEDR',
                        },
                        {
                            orgnr: '118345674',
                            underenheter: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'BEDR',
                        },
                        {
                            orgnr: '119985432',
                            underenheter: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'BEDR',
                        },
                        {
                            orgnr: '119988432',
                            underenheter: [],
                            navn: faker.company.name(),
                            organisasjonsform: 'BEDR',
                        },
                    ],
                    navn: faker.company.name(),
                    organisasjonsform: 'AS',
                },
            ],
            tilganger: {
                '5384:1': ['182345674', '118345674', '119985432', '119988432'],
                '4936:1': ['182345674', '118345674', '119985432', '119988432'],
                '4826:1': ['182345674', '118345674', '119985432', '119988432'],
                '5332:1': ['182345674', '118345674', '119985432', '119988432'],
                '5441:1': ['182345674', '118345674', '119985432', '119988432'],
                '5516:1': ['182345674', '118345674', '119985432', '119988432'],
                '5516:2': ['182345674', '118345674', '119985432', '119988432'],
                '5516:3': ['182345674', '118345674', '119985432', '119988432'],
                '5516:4': ['182345674', '118345674', '119985432', '119988432'],
                '5516:5': ['182345674', '118345674', '119985432', '119988432'],
                'nav_forebygge-og-redusere-sykefravar_sykefravarsstatistikk': [
                    '182345674',
                    '118345674',
                    '119985432',
                    '119988432',
                ],
                'nav_forebygge-og-redusere-sykefravar_samarbeid': [
                    '182345674',
                    '118345674',
                    '119985432',
                    '119988432',
                ],
                '5078:1': ['182345674', '118345674', '119985432', '119988432'],
                '5278:1': ['182345674', '118345674', '119985432', '119988432'],
                '5902:1': ['182345674', '118345674', '119985432', '119988432'],
            },
            digisyfoError: false,
            digisyfoOrganisasjoner: [
                {
                    orgnr: '121488424',
                    navn: 'BIRTAVARRE OG VÆRLANDET FORELDER',
                    organisasjonsform: 'AS',
                    antallSykmeldte: 0,
                    underenheter: [
                        {
                            orgnr: '999999999',
                            navn: 'Saltrød og Høneby',
                            organisasjonsform: 'BEDR',
                            antallSykmeldte: 0,
                            underenheter: [],
                        },
                    ],
                },
                {
                    navn: 'BALLSTAD OG HORTEN',
                    orgnr: '118345674',
                    organisasjonsform: 'FLI',
                    antallSykmeldte: 0,
                    underenheter: [
                        {
                            navn: 'BALLSTAD OG HAMARØY',
                            organisasjonsform: 'AAFY',
                            orgnr: '182345674',
                            antallSykmeldte: 4,
                            underenheter: [],
                        },
                    ],
                },
                {
                    navn: 'BareSyfo Juridisk',
                    orgnr: '111111111',
                    organisasjonsform: 'FLI',
                    antallSykmeldte: 4,
                    underenheter: [
                        {
                            navn: 'BareSyfo Virksomhet',
                            organisasjonsform: 'AAFY',
                            orgnr: '121212121',
                            antallSykmeldte: 4,
                            underenheter: [],
                        },
                    ],
                },
            ],
            refusjoner: [
                {
                    virksomhetsnummer: '999999999',
                    statusoversikt: {
                        KLAR_FOR_INNSENDING: 3,
                        FOR_TIDLIG: 1,
                    },
                    tilgang: true,
                },
                {
                    virksomhetsnummer: '121488424',
                    statusoversikt: {
                        KLAR_FOR_INNSENDING: 1,
                        FOR_TIDLIG: 2,
                    },
                    tilgang: true,
                },
                {
                    virksomhetsnummer: '182345674',
                    statusoversikt: {
                        FOR_TIDLIG: 2,
                    },
                    tilgang: true,
                },
            ],
        })
    ),
    http.post(`${__BASE_PATH__}/api/varslingStatus/v1`, () =>
        HttpResponse.json({
            status: 'OK',
            varselTimestamp: '2021-01-01T00:00:00',
            kvittertEventTimestamp: '2021-01-04T00:00:00Z',
        })
    ),
    http.get(/.*arbeidsgiver-arbeidsforhold-api\/antall-arbeidsforhold.*/, () =>
        HttpResponse.json({
            second: 53,
        })
    ),
    http.get(/.*presenterte-kandidater-api\/ekstern\/antallkandidater.*/, () =>
        HttpResponse.json({
            antallKandidater: 85,
        })
    ),
    http.get(`${__BASE_PATH__}/stillingsregistrering-api/api/stillinger/numberByStatus`, () =>
        HttpResponse.json({ PUBLISERT: 20 })
    ),
    http.post(`${__BASE_PATH__}/stillingsregistrering-api/api/arbeidsgiver/:orgnr`, () =>
        HttpResponse.json({})
    ),
    http.get(/.*tiltaksgjennomforing-api\/avtaler.*/, () =>
        HttpResponse.json([
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'INKLUDERINGSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'SOMMERJOBB',
            },
            {
                tiltakstype: 'VARIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'ARBEIDSTRENING',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MENTOR',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
            {
                tiltakstype: 'MIDLERTIDIG_LONNSTILSKUDD',
            },
        ])
    ),
    http.get(/.*api\/sykefravaerstatistikk.*/, () =>
        HttpResponse.json({
            type: 'BRANSJE',
            label: 'Barnehager',
            prosent: 15.8,
        })
    ),
    http.post(`${__BASE_PATH__}/api/ereg/underenhet`, ({ request }) => {
        const orgnr = '42';
        const parentOrgnummer = '44';
        return HttpResponse.json({
            organisasjonsnummer: orgnr,
            navn: faker.company.name(),
            organisasjonsform: {
                kode: 'BEDR',
                beskrivelse: 'Bedrift',
                _links: {
                    self: {
                        href: '/min-side-arbeidsgiver/api/ereg/organisasjonsformer/BEDR',
                    },
                },
            },
            postadresse: {
                land: 'Norge',
                landkode: 'NO',
                postnummer: '1358',
                poststed: 'JAR',
                adresse: faker.location.streetAddress(),
                kommune: 'BÆRUM',
                kommunenummer: '3024',
            },
            registreringsdatoEnhetsregisteret: '2010-12-15',
            registrertIMvaregisteret: false,
            naeringskoder: ['66.110'],
            antallAnsatte: 42,
            overordnetEnhet: parentOrgnummer,
            oppstartsdato: '2010-12-15',
            datoEierskifte: '2010-12-15',
            hjemmeside: null,
            beliggenhetsadresse: {
                land: 'Norge',
                landkode: 'NO',
                postnummer: '7950',
                poststed: 'ABELVÆR',
                adresse: faker.location.streetAddress(),
                kommune: 'NÆRØYSUND',
                kommunenummer: '5060',
            },
            forretningsadresse: {
                land: 'Norge',
                landkode: 'NO',
                postnummer: '7950',
                poststed: 'ABELVÆR',
                adresse: faker.location.streetAddress(),
                kommune: 'NÆRØYSUND',
                kommunenummer: '5060',
            },
            _links: {
                self: {
                    href: '/min-side-arbeidsgiver/api/ereg/underenheter/' + orgnr,
                },
                overordnetEnhet: {
                    href: '/min-side-arbeidsgiver/api/ereg/enheter/' + parentOrgnummer,
                },
            },
        });
    }),
    http.get(`${__BASE_PATH__}/api/altinn-tilgangssoknad`, () =>
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
        ])
    ),
    http.post(`${__BASE_PATH__}/api/kontonummerStatus/v1`, () =>
        HttpResponse.json({
            status: 'OK',
        })
    ),

    hentSakerResolver(alleSaker),
    sakstyperResolver(alleSaker.map(({ merkelapp }) => merkelapp as Merkelapp)),
    hentKalenderavtalerResolver(alleKalenderavtaler),
    hentNotifikasjonerResolver(alleNotifikasjoner),
    hentSakByIdResolver(alleSaker),
    hentNotifikasjonerSistLest(new Date()),
    setNotifikasjonerSistLest()
);
