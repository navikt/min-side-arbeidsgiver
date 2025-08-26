import {expect, test} from 'vitest';
import {beregnVirksomhetsnummer} from './useSaker';
import Immutable from 'immutable';

test('beregnVirksomhetsnummer fungerer som forventet', () => {
    const tre = [
        {
            orgnr: '1',
            navn: '1',
            organisasjonsform: 'AS',
            underenheter: [
                {orgnr: '1.2', navn: '1.2', organisasjonsform: 'BEDR', underenheter: []},
            ],
        },
        {
            orgnr: '1.1',
            navn: '1.1',
            organisasjonsform: 'ORGL',
            underenheter: [
                {orgnr: '1.1.1', navn: '1.1.1', organisasjonsform: 'BEDR', underenheter: []},
            ],
        },
        {
            orgnr: '1.3.1',
            navn: '1.3.1',
            organisasjonsform: 'ORGL',
            underenheter: [
                {orgnr: '1.3.1.1', navn: '1.3.1.1', organisasjonsform: 'BEDR', underenheter: []},
                {orgnr: '1.3.1.2', navn: '1.3.1.2', organisasjonsform: 'BEDR', underenheter: []},
            ],
        },
    ];

    expect(beregnVirksomhetsnummer(tre, Immutable.Set([]))).toEqual([
        '1',
        '1.2',
        '1.1',
        '1.1.1',
        '1.3.1',
        '1.3.1.1',
        '1.3.1.2',
    ]);
    expect(beregnVirksomhetsnummer(tre, Immutable.Set(['1.3.1']))).toEqual([
        '1.3.1',
        '1.3.1.1',
        '1.3.1.2',
    ]);
    expect(beregnVirksomhetsnummer(tre, Immutable.Set(['1.3.1', '1.3.1.1']))).toEqual([
        '1.3.1',
        '1.3.1.1',
    ]);
});

const mapTekstsoekForBackend = (s: string): string => {
    const digitsOnly = s.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
        const fodselsdato = digitsOnly.substring(0, 6);
        return s.replace(/\d[\d\s-]{9,}\d/, fodselsdato).trim();
    }
    return s;
};

describe('mapTekstsoekForBackend', () => {
    test('ren 11-sifret streng → fødselsdato (første 6)', () => {
        expect(mapTekstsoekForBackend('26118644144')).toBe('261186');
    });

    test('11 siffer med mellomrom → fødselsdato', () => {
        expect(mapTekstsoekForBackend('26 11 86 44144')).toBe('261186');
    });

    test('11 siffer med bindestrek → fødselsdato', () => {
        expect(mapTekstsoekForBackend('121212-44144')).toBe('121212');
    });

    test('tekst + 11 siffer → erstatt bare fnr-delen med dato og behold tekst', () => {
        expect(mapTekstsoekForBackend('test 26118644144')).toBe('test 261186');
        expect(mapTekstsoekForBackend('Dette er en ny sak for Noén Andrè f. 12121244144'))
            .toBe('Dette er en ny sak for Noén Andrè f. 121212');
    });

    test('kun 6 siffer (fødselsdato) → uendret', () => {
        expect(mapTekstsoekForBackend('261186')).toBe('261186');
    });

    test('ingen tall → uendret', () => {
        expect(mapTekstsoekForBackend('bare tekst')).toBe('bare tekst');
    });

    test('12 siffer → uendret (ikke et fnr)', () => {
        expect(mapTekstsoekForBackend('123456789012')).toBe('123456789012');
    });

    test('11 siffer spredt med blandede mellomrom/streker → erstattes', () => {
        expect(mapTekstsoekForBackend('12 12-12 44144')).toBe('121212');
    });

    test('tekst som inneholder 6 siffer og senere 5 siffer (totalt 11, men ikke i én sekvens) skal også fanges', () => {
        expect(mapTekstsoekForBackend('f. 121212 44144 er oppgitt')).toBe('f. 121212 er oppgitt');
    });
});
