import { expect, test } from 'vitest';
import { beregnVirksomhetsnummer } from './useSaker';

test('beregnVirksomhetsnummer fungerer som forventet', () => {
    const tre = [
        {
            orgnr: '1',
            navn: '1',
            organisasjonsform: 'AS',
            underenheter: [
                { orgnr: '1.2', navn: '1.2', organisasjonsform: 'BEDR', underenheter: [] },
            ],
        },
        {
            orgnr: '1.1',
            navn: '1.1',
            organisasjonsform: 'ORGL',
            underenheter: [
                { orgnr: '1.1.1', navn: '1.1.1', organisasjonsform: 'BEDR', underenheter: [] },
            ],
        },
        {
            orgnr: '1.3.1',
            navn: '1.3.1',
            organisasjonsform: 'ORGL',
            underenheter: [
                { orgnr: '1.3.1.1', navn: '1.3.1.1', organisasjonsform: 'BEDR', underenheter: [] },
                { orgnr: '1.3.1.2', navn: '1.3.1.2', organisasjonsform: 'BEDR', underenheter: [] },
            ],
        },
    ];

    expect(beregnVirksomhetsnummer(tre, [])).toEqual([
        '1',
        '1.2',
        '1.1',
        '1.1.1',
        '1.3.1',
        '1.3.1.1',
        '1.3.1.2',
    ]);
    expect(beregnVirksomhetsnummer(tre, ['1.3.1'])).toEqual(['1.3.1', '1.3.1.1', '1.3.1.2']);
    expect(beregnVirksomhetsnummer(tre, ['1.3.1', '1.3.1.1'])).toEqual(['1.3.1', '1.3.1.1']);
});
