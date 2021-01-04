import { gittMiljo } from './utils/environment';
import { basename } from './paths';

export const skjemaForArbeidsgivere = 'https://www.nav.no/soknader/nb/bedrift';

export const arbeidsforholdLink = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
    labs: 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/',
    other: 'https://arbeidsgiver-q.nav.no/arbeidsforhold/',
});

export const syfoLink = gittMiljo({
    prod: 'https://tjenester.nav.no/sykefravaerarbeidsgiver',
    other: 'https://tjenester-q1.nav.no/sykefravaerarbeidsgiver',
    labs: 'https://sykefravaerarbeidsgiver.labs.nais.io/sykefravaerarbeidsgiver/'
});

export const linkTilArbeidsplassen = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/bedrift',
    other: 'https://arbeidsplassen-q.nav.no/bedrift',
});

export const pamSettBedriftLenke: (orgnr: string) => string = gittMiljo({
    prod: orgnr =>
        `https://arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
    other: orgnr =>
        `https://arbeidsplassen-q.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
});

export const sjekkInnloggetLenke = basename + '/api/innlogget';

export const pamHentStillingsannonserLenke = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
    other:
        'https://arbeidsplassen-q.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
});

export const digiSyfoNarmesteLederLink = '/min-side-arbeidsgiver/api/narmesteleder';

export const LenkeTilInfoOmNarmesteLeder =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/hvordan-melde-inn-naermeste-leder-for-en-sykmeldt_kap';

export const LenkeTilInfoOmRettigheterTilSykmelding =
    'https://www.nav.no/no/Bedrift/Oppfolging/Sykmeldt+arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/om-tilganger-i-altinn';

export const LenkeTilInfoOmAltinnRoller =
    'https://www.altinn.no/hjelp/profil/roller-og-rettigheter/';

export const lenkeTilInfoOmSykefravarsstatistikk =
    'https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyheter/fa-oversikt-over-sykefravaeret';

export const hentUnderenhetApiLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/api/underenheter/${orgnr}`;

export const hentOverordnetEnhetApiLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`;

export const enhetsregisteretUnderenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/underenheter/${orgnr}`;

export const enhetsregisteretOverordnetenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/enheter/${orgnr}`;

export const altinnUrl = gittMiljo({
    prod: 'https://altinn.no',
    other: 'https://tt02.altinn.no',
});

export const beOmTilgangIAltinnLink = (
    orgnr: string,
    serviceKode: string,
    serviceEditionKode: string
) =>
    `${altinnUrl}/ui/DelegationRequest?offeredBy=${orgnr}&resources=${serviceKode}_${serviceEditionKode}`;

export const lenkeTilDittNavPerson = 'https://www.nav.no/person/dittnav/';

export const lenkeTilTilgangsstyringsInfo =
    'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/informasjon-om-tilgangsstyring';


export const lenkeTilSykefravarsstatistikk = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/sykefravarsstatistikk/',
    labs: 'https://arbeidsgiver.labs.nais.io/sykefravarsstatistikk/',
    other: 'https://arbeidsgiver-q.nav.no/sykefravarsstatistikk/',
});


export const lenkeTilInfoOmDigitaleSoknader =
    'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/altinn-skjemaer-refusjoner-meldinger2/soknader-om-arbeidsmarkedstiltak-og-tilskudd-fra-nav';

export const lenkeTilInforOmInntekstmelding =
    'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding';

export const lenkeTilPermitteringOgMasseoppsigelsesSkjema = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/permittering/',
    other: 'https://arbeidsgiver-q.nav.no/permittering/',
});

export const urlMedBedriftNr = (baseUrl: string) => (orgnr: string) =>
    baseUrl + (orgnr.length > 0 ? '?bedrift=' + orgnr : '');

export const lenkeTilKlageskjema = urlMedBedriftNr(
    gittMiljo({
        prod: 'https://arbeidsgiver.nav.no/klage-permittering-refusjon/',
        other: 'https://arbeidsgiver-q.nav.no/klage-permittering-refusjon/',
    })
);

export const LenkeTilKoronaSykeRefusjon = urlMedBedriftNr(
    gittMiljo({
        prod: 'https://arbeidsgiver.nav.no/nettrefusjon/',
        other: 'https://arbeidsgiver-q.nav.no/nettrefusjon/',
    })
);

export const tiltaksgjennomforingLink = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    labs: 'https://arbeidsgiver.labs.nais.io/tiltaksgjennomforing/?part=arbeidsgiver',
    other: 'https://arbeidsgiver-q.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
});

export const lenkeTilInfoOmPermittering =
    'https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyheter/permitteringer-som-folge-av-koronaviruset';

export const lenkeTilInfoOmRefusjonSykepengerKorona =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/nyheter/refusjon-av-sykepenger-ved-koronavirus--hva-er-status#chapter-2';
