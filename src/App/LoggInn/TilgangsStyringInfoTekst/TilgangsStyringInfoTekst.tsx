import React from 'react';
import { Element } from 'nav-frontend-typografi';
import { basename } from '../../../paths';
import InfoIkon from './InfoIkon';
import './TilgangsStyringInfoTekst.less';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';

export const TilgangsStyringInfoTekst = () => {
    return (
        <div className="informasjonsboks">
            <InfoIkon size="24"/>
            <div className="informasjonsboks__tekst">
                <Element className="informasjonsboks__overskrift">
                    Tildeling av roller foregår i Altinn
                </Element>
                <LenkeMedLogging href={basename + '/informasjon-om-tilgangsstyring'} loggLenketekst="Les mer om roller og tilganger">
                    Les mer om roller og tilganger
                </LenkeMedLogging>
            </div>
        </div>
    );
};
