import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { toHaveNoViolations } from 'jest-axe';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './src/tests/mocks';

expect.extend(matchers);
expect.extend(toHaveNoViolations);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// @ts-ignore
(window as any).environment = { MILJO: 'test' };
