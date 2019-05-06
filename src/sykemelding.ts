export interface MottakendeArbeidsgiver {
  navn: string;
  virksomhetsnummer: string;
  juridiskOrgnummer: string;
}

export interface Pasient {
  fnr: string;
  fornavn: string;
  mellomnavn?: any;
  etternavn: string;
}

export interface Hoveddiagnose {
  diagnose: string;
  diagnosekode: string;
  diagnosesystem: string;
}

export interface Bidiagnoser {
  diagnose: string;
  diagnosekode: string;
  diagnosesystem: string;
}

export interface Diagnose {
  hoveddiagnose: Hoveddiagnose;
  bidiagnoser: Bidiagnoser[];
  fravaersgrunnLovfestet?: any;
  fravaerBeskrivelse: string;
  svangerskap: boolean;
  yrkesskade: boolean;
  yrkesskadeDato: string;
}

export interface Perioder {
  fom: string;
  tom: string;
  grad: number;
  behandlingsdager?: any;
  reisetilskudd: boolean;
  avventende?: any;
}

export interface MulighetForArbeid {
  perioder: Perioder[];
  aktivitetIkkeMulig433?: any;
  aktivitetIkkeMulig434?: any;
  aarsakAktivitetIkkeMulig433?: any;
  aarsakAktivitetIkkeMulig434?: any;
}

export interface Friskmelding {
  arbeidsfoerEtterPerioden: boolean;
  hensynPaaArbeidsplassen: string;
  antarReturSammeArbeidsgiver: boolean;
  antattDatoReturSammeArbeidsgiver: string;
  antarReturAnnenArbeidsgiver: boolean;
  tilbakemeldingReturArbeid: string;
  utenArbeidsgiverAntarTilbakeIArbeid: boolean;
  utenArbeidsgiverAntarTilbakeIArbeidDato?: any;
  utenArbeidsgiverTilbakemelding?: any;
}

export interface UtdypendeOpplysninger {
  sykehistorie?: any;
  paavirkningArbeidsevne?: any;
  resultatAvBehandling?: any;
  henvisningUtredningBehandling?: any;
  grupper: any[];
}

export interface Arbeidsevne {
  tilretteleggingArbeidsplass: string;
  tiltakNAV: string;
  tiltakAndre?: any;
}

export interface MeldingTilNav {
  navBoerTaTakISaken: boolean;
  navBoerTaTakISakenBegrunnelse?: any;
}

export interface Tilbakedatering {
  dokumenterbarPasientkontakt?: any;
  tilbakedatertBegrunnelse?: any;
}

export interface Bekreftelse {
  utstedelsesdato: string;
  sykmelder: string;
  sykmelderTlf: string;
}

export interface Sykemelding {
  id: string;
  startLegemeldtFravaer: string;
  skalViseSkravertFelt: boolean;
  identdato: string;
  status: string;
  naermesteLederStatus?: any;
  innsendtArbeidsgivernavn: string;
  valgtArbeidssituasjon?: any;
  mottakendeArbeidsgiver: MottakendeArbeidsgiver;
  orgnummer: string;
  sendtdato: Date;
  sporsmal?: any;
  pasient: Pasient;
  arbeidsgiver: string;
  stillingsprosent: number;
  diagnose: Diagnose;
  mulighetForArbeid: MulighetForArbeid;
  friskmelding: Friskmelding;
  utdypendeOpplysninger: UtdypendeOpplysninger;
  arbeidsevne: Arbeidsevne;
  meldingTilNav: MeldingTilNav;
  innspillTilArbeidsgiver?: any;
  tilbakedatering: Tilbakedatering;
  bekreftelse: Bekreftelse;
}
