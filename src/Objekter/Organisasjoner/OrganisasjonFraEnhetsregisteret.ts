export interface ListeMedJuridiskeEnheter {
    _embedded: {
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
    organisasjonsform: organisasjonsform;
    naeringskode1: naeringskode1;
    naeringskode2: naeringskode2;
    naeringskode3: naeringskode3;
    postadresse: postadresse;
    forretningsadresse: forretningsadresse;
    hjemmeside: string;
    overordnetEnhet: string;
    antallAnsatte: string;
    beliggenhetsadresse: beliggenhetsadresse;
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
    kommune: string;
}

export interface institusjonellSektorkode {
    kode: string;
    beskrivelse: string;

}

export const tomEnhetsregOrg: OrganisasjonFraEnhetsregisteret = {
    organisasjonsnummer: '',
    navn: '',
    organisasjonsform: {
        kode: '',
        beskrivelse: '',
    },
    overordnetEnhet: '',
    antallAnsatte: '',
    hjemmeside: '',
    postadresse: {
        land: '',
        landkode: '',
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: '',
    },

    beliggenhetsadresse: {
        kommune: '',
    },
    forretningsadresse: {
        land: '',
        landkode: '',
        postnummer: '',
        poststed: '',
        adresse: [''],
        kommune: '',
        kommunenummer: '',
    },
    naeringskode1: {
        beskrivelse: '',
        kode: '',
    },
    naeringskode2: {
        beskrivelse: '',
        kode: '',
    },
    naeringskode3: {
        beskrivelse: '',
        kode: '',
    },
    institusjonellSektorkode: {
        kode: '',
        beskrivelse:''
    }
};
