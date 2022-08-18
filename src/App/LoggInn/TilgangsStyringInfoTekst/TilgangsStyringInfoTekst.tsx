import React from 'react';
import { basename } from '../../../paths';
import InfoIkon from './InfoIkon';
import './TilgangsStyringInfoTekst.css';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import {Label} from "@navikt/ds-react";

export const TilgangsStyringInfoTekst = () => {
    return (
        <div className="informasjonsboks">
            <InfoIkon size="24"/>
            <div className="informasjonsboks__tekst">
                <Label size="small" className="informasjonsboks__overskrift">
                    Tildeling av roller foregår i Altinn
                </Label>
                <LenkeMedLogging href={basename + '/informasjon-om-tilgangsstyring'} loggLenketekst="Les mer om roller og tilganger">
                    Les mer om roller og tilganger
                </LenkeMedLogging>
            </div>
        </div>
    );
};
