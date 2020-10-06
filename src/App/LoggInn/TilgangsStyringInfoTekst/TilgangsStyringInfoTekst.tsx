import React from 'react';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { basename } from '../../../paths';
import InfoIkon from './InfoIkon';
import './TilgangsStyringInfoTekst.less';

export const TilgangsStyringInfoTekst = () => {
    return (
        <div className="informasjonsboks">
            <InfoIkon size="24"/>
            <div className="informasjonsboks__tekst">
                <Element className="informasjonsboks__overskrift">
                    Tildeling av roller foregår i Altinn
                </Element>
                <Lenke href={basename + '/informasjon-om-tilgangsstyring'}>
                    Les mer om roller og tilganger
                </Lenke>
            </div>
        </div>
    );
};
