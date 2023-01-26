import {gittMiljo} from './utils/environment';
import {altinnUrl} from "./api/altinnApi";

export const skjemaForArbeidsgiverURL =
    'https://www.nav.no/soknader/nb/bedrift';

export const innsynAaregURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
    labs: 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/',
    other: 'https://arbeidsforhold.dev.nav.no/arbeidsforhold/',
});

export const syfoURL = gittMiljo({
    prod: 'https://www.nav.no/arbeidsgiver/sykmeldte',
    other: 'https://www-gcp.dev.nav.no/arbeidsgiver/sykmeldte',
    labs: 'https://dinesykmeldte.labs.nais.io/arbeidsgiver/sykmeldte',
});

export const refosoURL = gittMiljo({
    prod: 'https://tiltak-refusjon.nav.no/refusjon',
    other: 'https://tiltak-refusjon.dev.nav.no/refusjon',
    labs: 'https://tiltak-refusjon-arbeidsgiver.labs.nais.io/refusjon',
})

export const arbeidsplassenURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/bedrift',
    other: 'https://arbeidsplassen.dev.nav.no/bedrift',
});

export const kandidatlisteURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/kandidatliste',
    other: 'https://presenterte-kandidater.dev.nav.no/kandidatliste',
});

export const kontaktskjemaURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/kontakt-oss/kontaktskjema',
    other: 'https://arbeidsgiver-kontakt-oss.dev.nav.no/kontakt-oss/kontaktskjema',
})

export const ringOssTLF = gittMiljo({
    prod: "tel:55553336",
    other: "tel:00000000"
})


export const infoOmNærmesteLederURL =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/hvordan-melde-inn-naermeste-leder-for-en-sykmeldt_kap';

export const infoOmRettigheterTilSykemeldingURL =
    'https://www.nav.no/no/Bedrift/Oppfolging/Sykmeldt+arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/om-tilganger-i-altinn';

export const infoOmAltinnVarslerURL =
    'https://www.altinn.no/hjelp/profil/kontaktinformasjon/';

export const spørreOmRettigheterAltinnURL=
    'https://www.altinn.no/hjelp/profil/sporre-om-rettighet/';

export const infoOmSykefraværsstatistikk =
    'https://arbeidsgiver.nav.no/forebygge-sykefravaer/#digitale-tjenester';



export const enhetsregisteretUnderenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/underenheter/${orgnr}`;

export const enhetsregisteretOverordnetenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/enheter/${orgnr}`;

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

export const lenkeTilForebyggefravar = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/forebygge-fravar/',
    labs: 'https://arbeidsgiver.labs.nais.io/forebygge-fravar/',
    other: 'https://forebygge-fravar.dev.nav.no/forebygge-fravar/',
});

export const lenkeTilInfoOmDigitaleSoknader =
    'https://arbeidsgiver.nav.no/veiviserarbeidsgiver/tema/hvordan-kan-nav-hjelpe-med-inkludering';

export const lenkeTilInforOmInntekstmelding =
    'https://www.nav.no/no/bedrift/tjenester-og-skjemaer/nav-og-altinn-tjenester/inntektsmelding';

export const lenkeTilPermitteringOgMasseoppsigelsesSkjema = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/permittering/',
    labs: 'https://permitteringsskjema.labs.nais.io/permittering',
    other: 'https://arbeidsgiver-q.nav.no/permittering/',
});

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

export const tiltaksgjennomforingURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    labs: 'https://arbeidsgiver.labs.nais.io/tiltaksgjennomforing/?part=arbeidsgiver',
    other: 'https://arbeidsgiver-q.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
});

export const infoOmPermitteringURL =
    'https://www.nav.no/arbeidsgiver/permittere-nedbemanne';

export const infoOmRefusjonSykepengerKoronaURL =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/nyheter/refusjon-av-sykepenger-ved-koronavirus--hva-er-status#chapter-2';

export const infoOmRefusjonInnreiseforbudKoronaURL =
    'https://www.nav.no/no/bedrift/refusjon-ved-innreiseforbud-under-pandemien';



