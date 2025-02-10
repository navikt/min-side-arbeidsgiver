import { expect, test } from 'vitest';
import { flatUtTre, alleOrganisasjonerFlatt, mapRecursive } from './util';

test('henter løvnoder og parent som flat liste', () => {
    const flat = flatUtTre(hierarki);
    expect(flat).toEqual([
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
    ]);
});

test('mapRecursive kan modifisere rekursivt', () => {
    const orgs = flatUtTre(hierarki);

    const mapped = mapRecursive(orgs, (org) => ({
        ...org,
        navn: org.navn + ' mapped',
    }));

    expect(mapped[0].navn).toBe(orgs[0].navn + ' mapped');
    expect(mapped[0].underenheter[0].navn).toBe(orgs[0].underenheter[0].navn + ' mapped');
});

test('alleOrganisasjonerFlatt gir alle noder i treet som en flat liste', () => {
    const flat = alleOrganisasjonerFlatt(hierarki);
    expect(flat.length).toEqual(9);
    expect(flat.map((o) => o.orgnr)).toEqual([
        '1',
        '1.1',
        '1.1.1',
        '1.2',
        '1.3',
        '1.3.1',
        '1.3.1.1',
        '1.3.1.2',
        '2',
    ]);
});

const hierarki = [
    {
        orgnr: '1',
        navn: '1',
        organisasjonsform: 'AS',
        underenheter: [
            {
                orgnr: '1.1',
                navn: '1.1',
                organisasjonsform: 'ORGL',
                underenheter: [
                    {
                        orgnr: '1.1.1',
                        navn: '1.1.1',
                        organisasjonsform: 'BEDR',
                        underenheter: [],
                    },
                ],
            },
            {
                orgnr: '1.2',
                navn: '1.2',
                organisasjonsform: 'BEDR',
                underenheter: [],
            },
            {
                orgnr: '1.3',
                navn: '1.3',
                organisasjonsform: 'ORGL',
                underenheter: [
                    {
                        orgnr: '1.3.1',
                        navn: '1.3.1',
                        organisasjonsform: 'ORGL',
                        underenheter: [
                            {
                                orgnr: '1.3.1.1',
                                navn: '1.3.1.1',
                                organisasjonsform: 'BEDR',
                                underenheter: [],
                            },
                            {
                                orgnr: '1.3.1.2',
                                navn: '1.3.1.2',
                                organisasjonsform: 'BEDR',
                                underenheter: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        orgnr: '2',
        navn: '2',
        organisasjonsform: 'AS',
        underenheter: [],
    },
];
