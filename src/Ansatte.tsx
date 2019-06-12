export interface enkelArbeidsforhold {
  arbeidsavtaler: Array<enkelArbeidsavtale>;
  sistbekreftet: string;
  arbeidstaker: arbeidstaker;
}

export interface arbeidstaker {
  aktoerId: number;
  offentligIdent: number;
}

export interface enkelArbeidsavtale {
  bruksperiode: bruksperiode;
  stillingsprosent: number;
  yrke: number;
  antallTimerPrUke: number;
}

export interface bruksperiode {
  fom: string;
  tom: string;
}

export interface HovedObjekt {
  antall: string;
  arbeidsforhold: Array<enkelArbeidsforhold>;
}
