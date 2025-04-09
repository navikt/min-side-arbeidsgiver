import { Kalenderavtale } from '../api/graphql-types';

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const erSammeDato = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const klokkeslett = (dato: Date) =>
    dato
        .toLocaleTimeString('no', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        .replace(':', '.');

export const formatterDato = (dato: Date) =>
    dato.toLocaleDateString('no', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export const sendtDatotekst = (dato: Date) => {
    if (erSammeDato(dato, today)) {
        return `I dag ${klokkeslett(dato)}`;
    } else if (erSammeDato(dato, yesterday)) {
        return `I går ${klokkeslett(dato)}`;
    } else {
        return formatterDato(dato);
    }
};

export const uformellDatotekst = (dato: Date) => {
    if (erSammeDato(dato, today)) return 'i dag';
    if (erSammeDato(dato, yesterday)) return 'i går';
    if (erSammeDato(dato, tomorrow)) return 'i morgen';
    return formatterDato(dato);
};

export const kalenderavtaleTidspunkt = (avtale: Kalenderavtale) => {
    const start = new Date(avtale.startTidspunkt);
    const slutt = avtale.sluttTidspunkt !== null ? new Date(avtale.sluttTidspunkt) : null;

    const startStr = start.toLocaleDateString('no', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    const sluttStr = slutt?.toLocaleTimeString('no', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return sluttStr !== null ? `${startStr} – ${sluttStr}` : startStr;
};
