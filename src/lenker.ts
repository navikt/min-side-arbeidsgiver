import {gittMiljo} from './utils/environment';
import {altinnUrl} from "./api/altinnApi";

export const skjemaForArbeidsgiverURL =
    'https://www.nav.no/soknader/nb/bedrift';

export const innsynAaregURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
    demo: 'https://arbeidsgiver.labs.nais.io/arbeidsforhold/',
    other: 'https://arbeidsforhold.dev.nav.no/arbeidsforhold/',
});

export const syfoURL = gittMiljo({
    prod: 'https://www.nav.no/arbeidsgiver/sykmeldte',
    other: 'https://www-gcp.dev.nav.no/arbeidsgiver/sykmeldte',
    demo: 'https://dinesykmeldte.ekstern.dev.nav.no/arbeidsgiver/sykmeldte',
});

export const refosoURL = gittMiljo({
    prod: 'https://tiltak-refusjon.nav.no/refusjon',
    other: 'https://tiltak-refusjon.dev.nav.no/refusjon',
    demo: 'https://tiltak-refusjon-arbeidsgiver.labs.nais.io/refusjon',
})

export const arbeidsplassenURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/bedrift',
    other: 'https://arbeidsplassen.intern.dev.nav.no/bedrift',
});

export const kandidatlisteURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/kandidatliste',
    other: 'https://presenterte-kandidater.intern.dev.nav.no/kandidatliste',
});

export const kontaktskjemaURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/kontakt-oss/kontaktskjema',
    other: 'https://arbeidsgiver-kontakt-oss.dev.nav.no/kontakt-oss/kontaktskjema',
})

export const ringOssTLF = gittMiljo({
    prod: "tel:55553336",
    other: "tel:00000000"
})

export const infoOmTilgangsstyringURL =
    'https://www.nav.no/arbeidsgiver/tilganger'

export const infoOmNærmesteLederURL =
    'https://www.nav.no/no/bedrift/oppfolging/sykmeldt-arbeidstaker/digital-sykmelding-informasjon-til-arbeidsgivere/hvordan-melde-inn-naermeste-leder-for-en-sykmeldt_kap';

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

export const lenkeTilForebyggefravar = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/forebygge-fravar/',
    demo: 'https://arbeidsgiver.ekstern.dev.nav.no/forebygge-fravar',
    other: 'https://forebygge-fravar.dev.nav.no/forebygge-fravar/',
});

export const lenkeTilForebyggingsplan = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/forebyggingsplan',
    demo: 'https://arbeidsgiver.ekstern.dev.nav.no/forebyggingsplan',
    other: 'https://forebyggingsplan-frontend.dev.nav.no/forebyggingsplan',
});

export const lenkeTilPermitteringOgMasseoppsigelsesSkjema = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/permittering/',
    demo: 'https://arbeidsgiver.ekstern.dev.nav.no/permittering',
    other: 'https://arbeidsgiver-q.nav.no/permittering/',
});

export const tiltaksgjennomforingURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    demo: 'https://arbeidsgiver.labs.nais.io/tiltaksgjennomforing/?part=arbeidsgiver',
    other: 'https://arbeidsgiver-q.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
});



