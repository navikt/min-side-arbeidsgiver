import React, { FunctionComponent } from 'react';
import { Undertittel, Element } from 'nav-frontend-typografi';

import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';


interface Props {
    navn: string;
    orgnummer: string;

}

const Organisasjonsbeskrivelse: FunctionComponent<Props> = (props) => {
    const { navn, orgnummer } = props;

    return (
        <div className="organisasjonsbeskrivelse">
            <div className="organisasjonsbeskrivelse__ikon">
                <UnderenhetIkon />
            </div>
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Element className="organisasjonsbeskrivelse__navn">{navn}</Element>
                org. nr. {orgnummer}
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
