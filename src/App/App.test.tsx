import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'

import fetchMock from 'fetch-mock';
// the mock lives in a __mocks__ directory
// to know more about manual mocks, access: https://jestjs.io/docs/en/manual-mocks

import App from './App' // see the tests for a full implementation

afterEach(cleanup)

test('Fetch makes an API call and displays the response in dropdown', async () => {
  const orgs = [{Name:'name1',Type:'asas', OrganizationNumber: '010', OrganizationForm:'AS',Status:'ok'},{Name:'name2',Type:'asas', OrganizationNumber: '020', OrganizationForm:'AS',Status:'ok'}];
  fetchMock.get('/ditt-nav-arbeidsgiver/api/organisasjoner', orgs);
  fetchMock.get('/pam', 403);
  const {getByText,getByTestId} = render(
      <App />,
  )
  //Vent på svar fra server
  const greetingTextNode = await waitForElement(() =>
      getByText('name1 org.nr : 010'),
  )
  const orgSelector = getByTestId("org-select");
  fireEvent.click(orgSelector)
  const org2 = getByText('name2 org.nr : 020')
  fireEvent.click(org2)
  const sykemeldingsboks = await waitForElement(() => getByText('Dine sykemeldte'), );
  expect(getByText("Rekruttering")).toBeFalsy();

})