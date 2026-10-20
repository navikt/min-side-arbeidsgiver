import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { MsaErrorBoundary } from './MsaErrorBoundary';

vi.mock('./Banner', () => ({
    SimpleBanner: () => <div>Min side – arbeidsgiver</div>,
}));

describe('MsaErrorBoundary', () => {
    afterEach(() => vi.restoreAllMocks());

    it('viser innhold når ingen feil oppstår', () => {
        render(
            <MsaErrorBoundary>
                <div>Innhold</div>
            </MsaErrorBoundary>
        );

        expect(screen.getByText('Innhold')).toBeInTheDocument();
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it.each([
        [new TypeError('Testfeil'), 'TypeError', 'Testfeil'],
        ['Testfeil', 'Error', 'Testfeil'],
        [null, 'Error', 'null'],
        [undefined, 'Error', 'undefined'],
    ])('viser feilmelding og logger kastet verdi %s', (error, name, message) => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const FeilendeKomponent = (): React.ReactNode => {
            throw error;
        };

        render(
            <MsaErrorBoundary>
                <FeilendeKomponent />
            </MsaErrorBoundary>
        );

        expect(screen.getByRole('alert')).toHaveTextContent('En ukjent feil ble oppdaget.');
        expect(screen.getByRole('link', { name: 'Last inn siden på nytt' })).toHaveAttribute(
            'href',
            window.location.href
        );
        expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining(
                `#FARO: Generisk feil ${name}:\nmessage: ${message}\ncomponentStack:`
            )
        );
    });
});
