enum Varseltype {
    BESKJED = 'BESKJED',
    OPPGAVE = 'OPPGAVE'
}

export interface Varsel {
    dato: Date;
    type: string;
    beskjed: string;
    varseltype: Varseltype;
    href: string;
}

let date1 = new Date();
date1.setHours(date1.getHours() - 1);

let date2 = new Date();
date2.setHours(date2.getHours() - 24);

let date3 = new Date();
date3.setHours(date3.getHours() - 48);

export const varsler: Varsel[] = [
    {
        dato: date1,
        type: 'ARBEIDSPLASSEN',
        beskjed: '4 nye kandidater lagt til i listen “Frontdesk medarbeider”',
        varseltype: Varseltype.BESKJED,
        href: ''
    },
    {
        dato: date2,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.OPPGAVE,
        href: ''
    },
    {
        dato: date3,
        type: 'DINE SYKMELDTE',
        beskjed: 'Svar på om du ønsker dialogmøte eller ikke',
        varseltype: Varseltype.OPPGAVE,
        href: ''
    }
];

const finnMaaned = (month: number): string => {
    switch (month) {
        case 0:
            return 'jan';
        case 1:
            return 'feb';
        case 2:
            return 'mars';
        case 3:
            return 'apr';
        case 4:
            return 'mai';
        case 5:
            return 'juni';
        case 6:
            return 'juli';
        case 7:
            return 'aug';
        case 8:
            return 'sep';
        case 9:
            return 'okt';
        case 10:
            return 'nov';
        case 11:
            return 'des';
    }
    return (month + 1).toString();
};

export const formatterDato = (dato: Date) => {
    return dato.getDate() + '. ' + finnMaaned(dato.getMonth()) + ' ' + dato.getFullYear();
};

let today = new Date();
let yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1);

export const isToday = (date: Date) => formatterDato(date) === formatterDato(today);
export const isYesterday = (date: Date) => formatterDato(date) === formatterDato(yesterday);

export const klokkeslett = (date: Date) => {
    let hour = date.getHours().toString();
    let minute = date.getMinutes().toString();
    if (hour.length < 2) {
        hour = '0' + hour;
    }
    if (minute.length < 2) {
        minute = '0' + minute;
    }
    return hour + '.' + minute;
};

export const datotekst = (date: Date) => {
    if (isToday(date)) {
        return 'Idag ' + klokkeslett(date)
    } else if (isYesterday(date)) {
        return 'Igår ' + klokkeslett(date)
    } else return formatterDato(date)
};