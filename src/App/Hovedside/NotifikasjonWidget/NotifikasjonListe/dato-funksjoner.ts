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

const formatterDato = (dato: Date) => {
    const date = new Date(dato);
    return date.getDate() + '. ' + finnMaaned(date.getMonth()) + ' ' + date.getFullYear();
};

let today = new Date();
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const isToday = (date: Date): boolean => formatterDato(date) === formatterDato(today);
export const isYesterday = (date: Date): boolean =>
    formatterDato(date) === formatterDato(yesterday);

export const klokkeslett = (dato: Date) => {
    let hour = dato.getHours().toString();
    let minute = dato.getMinutes().toString();
    if (hour.length < 2) {
        hour = '0' + hour;
    }
    if (minute.length < 2) {
        minute = '0' + minute;
    }
    return hour + '.' + minute;
};

export const datotekst = (date: Date, capitalize = false) => {
    const dato = new Date(date);
    if (isToday(dato)) {
        return (capitalize ? 'I' : 'i') + ' dag ' + klokkeslett(dato);
    } else if (isYesterday(date)) {
        return (capitalize ? 'I' : 'i') + ' går ' + klokkeslett(dato);
    } else return formatterDato(dato);
};
