export interface EnhetsregisteretOrg {
  organisasjonsnummer: string;
  navn: string;
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

export const defaultOrg: EnhetsregisteretOrg = {
  organisasjonsnummer: "889640782",
  navn: "ARBEIDS- OG VELFERDSETATEN",
  organisasjonsform: {
    kode: "ORGL",
    beskrivelse: "Organisasjonsledd"
  },
  hjemmeside: "www.nav.no",
  postadresse: {
    land: "Norge",
    landkode: "NO",
    postnummer: "0130",
    poststed: "OSLO",
    adresse: ["Postboks 5 St Olavs Plass"],
    kommune: "OSLO",
    kommunenummer: "0301"
  },
  naeringskode1: {
    beskrivelse:
      "Offentlig administrasjon tilknyttet helsestell, sosial virksomhet, undervisning, kirke, kultur og miljøvern",
    kode: "84.120"
  },
  naeringskode2: {
    beskrivelse:
      "Offentlig administrasjon tilknyttet helsestell, sosial virksomhet, undervisning, kirke, kultur og miljøvern",
    kode: "84.120"
  },
  naeringskode3: {
    beskrivelse:
      "Offentlig administrasjon tilknyttet helsestell, sosial virksomhet, undervisning, kirke, kultur og miljøvern",
    kode: "84.120"
  }
};
