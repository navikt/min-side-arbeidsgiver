// create an enum type for allMerkelapper

export enum Merkelapp {
    Arbeidstrening = 'Arbeidstrening',
    Fritak_i_arbeidsgiverperioden = 'Fritak i arbeidsgiverperioden',
    Inntektsmelding = 'Inntektsmelding',
    Inntektsmelding_sykepenger = 'Inntektsmelding sykepenger',
    Inntektsmelding_pleiepenger_sykt_barn = 'Inntektsmelding pleiepenger sykt barn',
    Inntektsmelding_foreldrepenger = 'Inntektsmelding foreldrepenger',
    Lønnstilskudd = 'Lønnstilskudd',
    Masseoppsigelse = 'Masseoppsigelse',
    Mentor = 'Mentor',
    Permittering = 'Permittering',
    Sommerjobb = 'Sommerjobb',
    Yrkesskade = 'Yrkesskade',
    Dialogmøte = 'Dialogmøte',
    Oppfølging = 'Oppfølging',
}

export const alleMerkelapper = Object.values(Merkelapp);
