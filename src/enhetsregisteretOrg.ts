export interface EnhetsregisteretOrg {
  organisasjonsnummer: string;
  organisasjonsform: organisasjonsform;
  naeringskode1: naeringskode1;
  naeringskode2: naeringskode2;
  naeringskode3: naeringskode3;
  postadresse: postadresse;
  hjemmeside: string;
}

export interface organisasjonsform {
  kode: string;
  beskrivelse: string;
}

export interface postadresse {
  adresse: string;
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
