export interface enkelArbeidsforhold {
  arbeidsavtaler: Array<enkelArbeidsavtale>;
  sistbekreftet: string;
  arbeidstaker: arbeidstaker;
  ansettelsesperiode: ansettelsesperiode;
}

export interface arbeidstaker {
  aktoerId: number;
  offentligIdent: number;
}

export interface enkelArbeidsavtale {
  stillingsprosent: number;
  yrke: number;
  antallTimerPrUke: number;
}

export interface ansettelsesperiode {
  periode: periode;
}

export interface periode {
  fom: string;
  tom: string;
}

export interface ObjektFraAAregisteret {
  antall: number;
  arbeidsforhold: Array<enkelArbeidsforhold>;
}
