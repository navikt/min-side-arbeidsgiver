
const måndenavn = [
    'jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni',
    'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'
];

const formatterDato = (dato: Date) =>
    `${dato.getDate()}. ${måndenavn[dato.getMonth()]} ${dato.getFullYear()}`;

const today = new Date();
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const isToday = (date: Date): boolean =>
    formatterDato(date) === formatterDato(today);

const isYesterday = (date: Date): boolean =>
    formatterDato(date) === formatterDato(yesterday);

const klokkeslett = (dato: Date) => {
    const hour = dato.getHours().toString().padStart(2, '0');
    const minute = dato.getMinutes().toString().padStart(2, '0');
    return hour + '.' + minute;
};

export const datotekst = (dato: Date, capitalize = false) => {
    if (isToday(dato)) {
        return (capitalize ? 'I' : 'i') + ' dag ' + klokkeslett(dato);
    } else if (isYesterday(dato)) {
        return (capitalize ? 'I' : 'i') + ' går ' + klokkeslett(dato);
    } else {
        return formatterDato(dato);
    }
};
