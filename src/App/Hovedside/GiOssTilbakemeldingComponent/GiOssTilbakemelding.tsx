import React from 'react';
import './GiOssTilbakemelding.less';
import Panel from 'nav-frontend-paneler';
import { Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';


export const GiOssTilbakemelding = () => {
    return (
        <Panel className={'tilbakemelding-banner'}>
            <div className={'innhold'}>
                <Normaltekst> Vi som jobber med løsningen vil høre dine erfaringer som arbeidsgiver.</Normaltekst>
                <Knapp>Book oss inn for en kort samtale</Knapp>
            </div>
        </Panel>
    );
};
