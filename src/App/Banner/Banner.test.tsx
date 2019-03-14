import { render, cleanup } from 'react-testing-library'
import Banner from './Banner'
import React from "react";
import { Organisasjon } from "../../organisasjon";

afterEach(cleanup)
describe('Banner', () => {
    const orgs = [{Name:'name1',Type:'asas', OrganizationNumber: '010', OrganizationForm:'AS',Status:'ok'},{Name:'name2',Type:'asas', OrganizationNumber: '020', OrganizationForm:'AS',Status:'ok'}];
    it('should contains name1', () => {
        const { getByText } = render(<Banner tittel={"Ditt nav arbeidsgiver"} bildeurl={"null"} organisasjoner={orgs}/>)
        getByText('name1 org.nr : 010');

    })
})