import React from 'react';
import { getByText, render, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import Pages from '../Pages/Pages';

describe('Backend er nede should not have any accessibility violations', () => {
    it('under lasting', async () => {
        const { container } = render(<Pages />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('etter lasting', async () => {
        const { container } = render(<Pages />);
        await waitFor(() => {
            expect(
                getByText(container, 'Uventet feil. Prøv å last siden på nytt.')
            ).toBeInTheDocument();
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
