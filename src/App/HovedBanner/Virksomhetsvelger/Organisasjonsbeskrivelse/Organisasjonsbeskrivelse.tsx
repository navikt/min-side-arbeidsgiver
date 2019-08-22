import React, { FunctionComponent } from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';

import { ReactComponent as Underenhetsikon } from './underenhet.svg';
import { ReactComponent as JuridiskEnhetsikon } from './juridiskEnhet.svg';
import './Organisasjonsbeskrivelse.less';

interface Props {
    navn: string;
    orgnummer: string;
    erJuridiskEnhet?: boolean;
    brukOverskrift?: boolean;
}

const Organisasjonsbeskrivelse: FunctionComponent<Props> = props => {
    const { navn, orgnummer, erJuridiskEnhet, brukOverskrift } = props;

    const Navn = brukOverskrift ? Undertittel : Element;
    const Ikon = erJuridiskEnhet ? JuridiskEnhetsikon : Underenhetsikon;

    return (
        <div className="organisasjonsbeskrivelse">
            <Ikon className="organisasjonsbeskrivelse__ikon" />
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Navn className="organisasjonsbeskrivelse__navn">{navn}</Navn>
                org. nr. {orgnummer}
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
