export interface EnhetsregisteretOrg {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform: organisasjonsform;
  naeringskode1: naeringskode1;
  naeringskode2: naeringskode2;
  naeringskode3: naeringskode3;
  postadresse: postadresse;
  forretningsadresse: forretningsadresse;
  hjemmeside: string;
  overordnetEnhet: string;
}

export interface organisasjonsform {
  kode: string;
  beskrivelse: string;
}

export interface postadresse {
  adresse: Array<string>;
  postnummer: string;
  poststed: string;
  kommunenummer: string;
  kommune: string;
  landkode: string;
  land: string;
}

export interface forretningsadresse {
  adresse: Array<string>;
  postnummer: string;
  poststed: string;
  kommunenummer: string;
  kommune: string;
  landkode: string;
  land: string;
}

export interface naeringskode1 {
  kode: string;
  beskrivelse: string;
}

export interface naeringskode2 {
  kode: string;
  beskrivelse: string;
}

export interface naeringskode3 {
  kode: string;
  beskrivelse: string;
}

export const tomEnhetsregOrg: EnhetsregisteretOrg = {
  organisasjonsnummer: "",
  navn: "",
  organisasjonsform: {
    kode: "",
    beskrivelse: ""
  },
  overordnetEnhet: "",
  hjemmeside: "",
  postadresse: {
    land: "",
    landkode: "",
    postnummer: "",
    poststed: "",
    adresse: [""],
    kommune: "",
    kommunenummer: ""
  },
  forretningsadresse: {
    land: "",
    landkode: "",
    postnummer: "",
    poststed: "",
    adresse: [""],
    kommune: "",
    kommunenummer: ""
  },
  naeringskode1: {
    beskrivelse: "",
    kode: ""
  },
  naeringskode2: {
    beskrivelse: "",
    kode: ""
  },
  naeringskode3: {
    beskrivelse: "",
    kode: ""
  }
};
