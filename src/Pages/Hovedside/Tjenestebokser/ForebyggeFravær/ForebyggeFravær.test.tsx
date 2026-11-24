import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ForebyggeFravær from './ForebyggeFravær';
import { useSykefravær } from './useSykefravær';

vi.mock('./useSykefravær');
vi.mock('../../../OrganisasjonsDetaljerContext', () => ({
    useOrganisasjonsDetaljerContext: () => ({
        valgtOrganisasjon: {
            organisasjon: { orgnr: '182345674' },
        },
    }),
}));

describe('ForebyggeFravær', () => {
    beforeEach(() => {
        vi.mocked(useSykefravær).mockReturnValue(undefined);
    });

    it('viser standardtekst uten statistikk', () => {
        render(<ForebyggeFravær />);

        expect(
            screen.getByText('Verktøy for å forebygge fravær i din virksomhet.')
        ).toBeInTheDocument();
    });

    it.each([
        ['NÆRING', 'bransje'],
        ['BRANSJE', 'bransje'],
        ['VIRKSOMHET', 'bedrift'],
    ])('viser statistikk av typen %s', (type, beskrivelse) => {
        vi.mocked(useSykefravær).mockReturnValue({ type, label: '', prosent: 5.2 });

        render(<ForebyggeFravær />);

        expect(screen.getByText('5.2 %')).toBeInTheDocument();
        expect(screen.getByText(`legemeldt sykefravær i din ${beskrivelse}.`)).toBeInTheDocument();
        expect(screen.getByText('Lag en plan for å redusere fraværet.')).toBeInTheDocument();
    });

    it('viser standardtekst når statistikken forsvinner etter nettleseroversettelse', () => {
        vi.mocked(useSykefravær).mockReturnValue({
            type: 'BRANSJE',
            label: '',
            prosent: 5.2,
        });
        const { rerender } = render(<ForebyggeFravær />);
        const tekstnoder: Text[] = [];
        const walker = document.createTreeWalker(screen.getByRole('link'), NodeFilter.SHOW_TEXT);

        while (walker.nextNode()) {
            if (walker.currentNode instanceof Text) {
                tekstnoder.push(walker.currentNode);
            }
        }

        // Nettleseroversettelse kan erstatte tekstnodene React fortsatt refererer til.
        for (const tekstnode of tekstnoder) {
            const oversettelse = document.createElement('font');
            oversettelse.textContent = tekstnode.textContent;
            tekstnode.replaceWith(oversettelse);
        }

        vi.mocked(useSykefravær).mockReturnValue(undefined);
        rerender(<ForebyggeFravær />);

        expect(
            screen.getByText('Verktøy for å forebygge fravær i din virksomhet.')
        ).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            expect.stringContaining('?bedrift=182345674')
        );
    });
});
