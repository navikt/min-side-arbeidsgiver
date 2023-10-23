import React from 'react';
import { Office1 as UnderenhetIkon } from "@navikt/ds-icons";
import './Organisasjonsbeskrivelse.css';
import {BodyShort, Label} from "@navikt/ds-react";

interface Props {
    navn: string;
    orgnummer: string;
}

const Organisasjonsbeskrivelse = ({navn, orgnummer}: Props) => {
    return (
        <div className="organisasjonsbeskrivelse">
            <div className="organisasjonsbeskrivelse__ikon">
                <UnderenhetIkon aria-hidden="true" title="underenhet" />
            </div>
            <div className="organisasjonsbeskrivelse__beskrivelse">
                <Label size="small" className="organisasjonsnavn">{navn}</Label>
                <BodyShort >virksomhetsnr. {orgnummer}</BodyShort>
            </div>
        </div>
    );
};

export default Organisasjonsbeskrivelse;
