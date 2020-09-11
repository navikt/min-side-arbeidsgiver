import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';

interface Props {
    navn: string;
    orgnummer: string;
}

const Organisasjonsbeskrivelse = ({ navn, orgnummer }: Props) => {
    return (
        <div className="organisasjonsbeskrivelse">
            <div className="organisasjonsbeskrivelse__ikon">
                <UnderenhetIkon />
            </div>
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Element className="organisasjonsnavn">{navn}</Element>
                <Normaltekst>org. nr. {orgnummer}</Normaltekst>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
