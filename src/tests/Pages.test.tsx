import React from 'react';
import { prettyDOM, render } from '@testing-library/react';
import { axe } from 'jest-axe';
import Pages from '../Pages/Pages';

describe('Backend er nede should not have any accessibility violations', () => {
    it('foo', async () => {
        const { container } = render(<Pages />);
        console.log(prettyDOM(container));
        const results = await axe(container);
        console.log(results.violations);
        expect(results).toHaveNoViolations();
    });
});
