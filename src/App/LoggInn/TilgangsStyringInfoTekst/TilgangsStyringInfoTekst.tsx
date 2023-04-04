import React from 'react';
import { InformationColored } from "@navikt/ds-icons"
import './TilgangsStyringInfoTekst.css';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import {Label} from "@navikt/ds-react";
import { infoOmTilgangsstyringURL } from '../../../lenker';

export const TilgangsStyringInfoTekst = () => {
    return (
        <div className="informasjonsboks">
            <InformationColored  title="informasjonsikon" aria-hidden="true"/>
            <div className="informasjonsboks__tekst">
                <Label size="small" className="informasjonsboks__overskrift">
                    Tildeling av roller foregår i Altinn
                </Label>
                <LenkeMedLogging href={infoOmTilgangsstyringURL} loggLenketekst="Les mer om roller og tilganger">
                    Les mer om roller og tilganger
                </LenkeMedLogging>
            </div>
        </div>
    );
}
