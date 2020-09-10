import React from 'react';
import ReactDOM from 'react-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from "./App";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
});

expect.extend(toHaveNoViolations);

test('should have no a11y violations', async () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
  const results = await axe(document.body);
  expect(results).toHaveNoViolations();
});