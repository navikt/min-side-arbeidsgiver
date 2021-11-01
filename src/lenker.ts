import { gittMiljo } from './utils/environment';
import { basename } from './paths';

export const skjemaForArbeidsgiverURL =
    'https://www.nav.no/soknader/nb/bedrift';

export const innsynAaregURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
    labs: 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/',
    other: 'https://arbeidsforhold.dev.nav.no/arbeidsforhold/',
});

export const syfoURL = gittMiljo({
    prod: 'https://tjenester.nav.no/sykefravaerarbeidsgiver',
    other: 'https://tjenester-q1.nav.no/sykefravaerarbeidsgiver',
    labs: 'https://sykefravaerarbeidsgiver.labs.nais.io/sykefravaerarbeidsgiver/',
});

export const arbeidsplassenURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/bedrift',
    other: 'https://arbeidsplassen.dev.nav.no/bedrift',
});

export const pamSettBedriftURL = gittMiljo({
    prod: (orgnr: string) =>
        `https://arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
    other: (orgnr: string) =>
        `https://arbeidsplassen.dev.nav.no//stillingsregistrering-api/api/arbeidsgiver/${orgnr}`,
});

export const sjekkInnloggetURL =
    basename + '/api/innlogget';

export const pamHentStillingsannonserURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
    other:
        'https://arbeidsplassen.dev.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
});

export const digiSyfoNarmesteLederURL =
    '/min-side-arbeidsgiver/api/narmesteleder';

export const infoOmNærmesteLederURL =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/hvordan-melde-inn-naermeste-leder-for-en-sykmeldt_kap';

export const infoOmRettigheterTilSykemeldingURL =
    'https://www.nav.no/no/Bedrift/Oppfolging/Sykmeldt+arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/om-tilganger-i-altinn';

export const infoOmAltinnrollerURL =
    'https://www.altinn.no/hjelp/profil/roller-og-rettigheter/';

export const infoOmSykefraværsstatistikk =
    'https://arbeidsgiver.nav.no/forebygge-sykefravaer/#digitale-tjenester';

export const hentUnderenhetApiURL = (orgnr: string) =>
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
    serviceEditionKode: string,
) =>
    `${altinnUrl}/ui/DelegationRequest?offeredBy=${orgnr}&resources=${serviceKode}_${serviceEditionKode}`;

export const lenkeTilDittNavPerson =
    'https://www.nav.no/person/dittnav/';

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
    labs: 'https://permitteringsskjema.labs.nais.io/permittering',
    other: 'https://arbeidsgiver-q.nav.no/permittering/',
});

export const lenkeTilPermitteringsInfo =
    'https://arbeidsgiver.nav.no/permittering-og-omstilling/permittering#lonnsplikt';

export const lenkeTilLonnskompensasjonOgRefusjon = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/permittering-refusjon/',
    other: 'https://arbeidsgiver-q.nav.no/permittering-refusjon/',
});

const lenkeTilKlageskjemaBase = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/klage-permittering-refusjon/',
    other: 'https://arbeidsgiver-q.nav.no/klage-permittering-refusjon/',
});

export const permitteringKlageskjemaURL = (orgnr: string) =>
    `${lenkeTilKlageskjemaBase}?bedrift=${orgnr}`;

const koronaSykeRefusjonBaseURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/nettrefusjon/',
    other: 'https://arbeidsgiver-q.nav.no/nettrefusjon/',
});

export const koronaSykeRefusjonURL = (orgnr: string) =>
    `${koronaSykeRefusjonBaseURL}?bedrift=${orgnr}`;

export const tiltaksgjennomforingURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    labs: 'https://arbeidsgiver.labs.nais.io/tiltaksgjennomforing/?part=arbeidsgiver',
    other: 'https://arbeidsgiver-q.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
});

export const infoOmPermitteringURL =
    'https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyheter/permitteringer-som-folge-av-koronaviruset';

export const infoOmRefusjonSykepengerKoronaURL =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/nyheter/refusjon-av-sykepenger-ved-koronavirus--hva-er-status#chapter-2';

export const infoOmRefusjonInnreiseforbudKoronaURL =
    'https://www.nav.no/no/bedrift/refusjon-ved-innreiseforbud-under-pandemien';

export const grensekompURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/grensekomp',
    labs: 'https://grensekomp-frontend.dev.nav.no/grensekomp',
    other: 'https://grensekomp-frontend.dev.nav.no/grensekomp',
});

export const grensekompOversiktURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/grensekomp/oversikt/krav',
    labs: 'https://grensekomp-frontend.dev.nav.no/grensekomp/oversikt/krav',
    other: 'https://grensekomp-frontend.dev.nav.no/grensekomp/oversikt/krav',
});

export const hentArbeidsavtalerApiLink =
    '/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/min-side-arbeidsgiver?';

export const møteBookingLenke='https://outlook.office365.com/owa/calendar/Minsidearbeidsgiver@nav.no/bookings/s/njkDNAYTM0aRtre0oKiKuQ2'