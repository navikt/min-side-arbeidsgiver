export interface enkelArbeidsforhold {
    arbeidsavtaler: Array<enkelArbeidsavtale>;
    sistbekreftet: string;
    arbeidstaker: arbeidstaker;
    ansettelsesperiode: ansettelsesperiode;
}

export interface arbeidstaker {
    aktoerId: number;
    offentligIdent: string;
}

export interface enkelArbeidsavtale {
    stillingsprosent: number;
    yrke: string;
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
    antall: string;
    arbeidsforholdoversikter: [
        {
            navn: string;
            ansattFom: string;
            ansattTom: string;
            arbeidsgiver: {
                type: string;
            };
            arbeidstaker: {
                type: string;
                aktoerId: string;
                offentligIdent: string;
            };
            innrapportertEtterAOrdningen: string;
            navArbeidsforholdId: string;
            opplysningspliktig: {
                type: string;
            };
            permisjonPermitteringsprosent: string;
            sistBekreftet: string;
            stillingsprosent: string;
            type: string;
            varslingskode: string;
            yrke: string;
        }
    ];
    startrad: string;
    totalAntall: string;
}

export const Mocksrespons: ObjektFraAAregisteret = {
    antall: '50',
    arbeidsforholdoversikter: [
        {
            navn: 'Gøril',
            ansattFom: '12/04/1814',
            ansattTom: '12/04/1913',
            arbeidsgiver: {
                type: 'IKEA',
            },
            arbeidstaker: {
                type: 'Selger',
                aktoerId: '444',
                offentligIdent: '666',
            },
            innrapportertEtterAOrdningen: 'JA',
            navArbeidsforholdId: '666',
            opplysningspliktig: {
                type: 'Sjef',
            },
            permisjonPermitteringsprosent: '49%',
            sistBekreftet: '1999',
            stillingsprosent: '21%',
            type: 'hardt arbeid',
            varslingskode: '787',
            yrke: 'vasker',
        },
    ],
    startrad: 'JA',
    totalAntall: 'JA',
};
