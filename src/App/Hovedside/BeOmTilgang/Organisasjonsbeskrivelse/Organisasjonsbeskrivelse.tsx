import React from 'react';
import UnderenhetIkon from './UnderenhetIkon';
import './Organisasjonsbeskrivelse.less';
import {BodyShort, Label} from "@navikt/ds-react";

interface Props {
    navn: string;
    orgnummer: string;
}

const Organisasjonsbeskrivelse = ({navn, orgnummer}: Props) => {
    return (
        <div className="organisasjonsbeskrivelse">
            <div className="organisasjonsbeskrivelse__ikon">
                <UnderenhetIkon/>
            </div>
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Label size="small" className="organisasjonsnavn">{navn}</Label>
                <BodyShort >org. nr. {orgnummer}</BodyShort>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
