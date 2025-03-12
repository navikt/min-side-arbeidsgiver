import { gittMiljo } from './utils/environment';

export const altinnUrl = gittMiljo({
    prod: 'https://altinn.no',
    dev: 'https://tt02.altinn.no',
    other: `${__BASE_PATH__}/mock/tt02.altinn.no`,
});

export const skjemaForArbeidsgiverURL = 'https://www.nav.no/soknader/nb/bedrift';

export const innsynAaregURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/arbeidsforhold/',
    demo: 'https://arbeidsforhold.ansatt.dev.nav.no/arbeidsforhold/',
    other: 'https://arbeidsforhold.intern.dev.nav.no/arbeidsforhold/',
});

export const syfoURL = gittMiljo({
    prod: 'https://www.nav.no/arbeidsgiver/sykmeldte',
    other: 'https://www.ekstern.dev.nav.no/arbeidsgiver/sykmeldte',
    demo: 'https://dinesykmeldte.ekstern.dev.nav.no/arbeidsgiver/sykmeldte',
});

export const tiltakRefusjonURL = gittMiljo({
    prod: 'https://tiltak-refusjon.nav.no/refusjon',
    other: 'https://tiltak-refusjon.intern.dev.nav.no/refusjon',
    demo: ' https://tiltak-refusjon-arbeidsgiver-labs.ekstern.dev.nav.no/refusjon',
});

export const arbeidsplassenURL = gittMiljo({
    prod: 'https://arbeidsplassen.nav.no/bedrift',
    other: 'https://arbeidsplassen.intern.dev.nav.no/bedrift',
});

export const kandidatlisteURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/kandidatliste',
    other: 'https://presenterte-kandidater.intern.dev.nav.no/kandidatliste',
    demo: 'https://presenterte-kandidater.ansatt.dev.nav.no/kandidatliste/samtykke',
});

export const kontaktskjemaURL = 'https://kontaktskjema.arbeidsgiver.nav.no/';

export const infoOmTilgangsstyringURL = 'https://www.nav.no/arbeidsgiver/tilganger';

export const infoOmNærmesteLederURL = 'https://www.nav.no/arbeidsgiver/tilganger#sykmelding';

export const enhetsregisteretUnderenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/underenheter/${orgnr}`;

export const enhetsregisteretOverordnetenhetLink = (orgnr: string) =>
    `https://data.brreg.no/enhetsregisteret/oppslag/enheter/${orgnr}`;

export const beOmTilgangIAltinnLink = (
    orgnr: string,
    serviceKode: string,
    serviceEditionKode: string
) =>
    `${altinnUrl}/ui/DelegationRequest?offeredBy=${orgnr}&resources=${serviceKode}_${serviceEditionKode}`;

export const lenkeTilDittNavPerson = 'https://www.nav.no/person/dittnav/';

export const lenkeTilForebyggefravar = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/forebygge-fravar/',
    demo: 'https://arbeidsgiver.ekstern.dev.nav.no/forebygge-fravar',
    other: 'https://forebygge-fravar.intern.dev.nav.no/forebygge-fravar/',
});

export const lenkeTilPermitteringOgMasseoppsigelsesSkjema = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/permittering/',
    demo: 'https://arbeidsgiver.ansatt.dev.nav.no/permittering',
    other: 'https://permitteringsskjema.intern.dev.nav.no/permittering/',
});

export const tiltaksgjennomforingURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    demo: 'https://tiltaksgjennomforing-labs.ekstern.dev.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    other: 'https://tiltaksgjennomforing.intern.dev.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
});

export const opprettInntektsmeldingURL = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/im-dialog/initiering',
    other: 'https://arbeidsgiver.intern.dev.nav.no/im-dialog/initiering',
});

export const opprettInntektsmeldingForeldrepenger = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/fp-im-dialog/agi?ytelseType=FORELDREPENGER',
    other: 'https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/agi?ytelseType=FORELDREPENGER'
})

export const opprettInntektsmeldingSvangerskapspenger = gittMiljo({
    prod: 'https://arbeidsgiver.nav.no/fp-im-dialog/agi?ytelseType=SVANGERSKAPSPENGER',
    other: 'https://arbeidsgiver.intern.dev.nav.no//fp-im-dialog/agi?ytelseType=SVANGERSKAPSPENGER'
})
