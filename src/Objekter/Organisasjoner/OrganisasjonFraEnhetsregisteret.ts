export interface ListeMedJuridiskeEnheter {
    _embedded?: {
        enheter: OrganisasjonFraEnhetsregisteret[];
    };
    _links: {
        self: {
            href: string;
        };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: 0;
    };
}

export interface OrganisasjonFraEnhetsregisteret {
    organisasjonsnummer: string;
    navn: string;
    organisasjonsform?: organisasjonsform;
    naeringskode1?: naeringskode1;
    naeringskode2?: naeringskode2;
    naeringskode3?: naeringskode3;
    postadresse?: postadresse;
    forretningsadresse?: forretningsadresse;
    hjemmeside: string;
    overordnetEnhet: string;
    antallAnsatte: string;
    beliggenhetsadresse?: beliggenhetsadresse;
    institusjonellSektorkode: institusjonellSektorkode;
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

export interface beliggenhetsadresse {
    land: string;
    landkode: string;
    postnummer: string;
    poststed: string;
    adresse: Array<string>;
    kommune: string;
    kommunenummer: string;
}

export interface institusjonellSektorkode {
    kode: string;
    beskrivelse: string;
}

