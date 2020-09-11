import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import ModalLenke from './ModalLenke/ModalLenke';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import NyFaneIkon from './NyFaneIkon';
import './TjenesteInfo.less';

export interface TjenesteInfoProps {
    overskrift: string;
    innholdstekst: string;
    lenkeTilBeOmTjeneste: string;
    erSyfo?: boolean;
    key?: string;
}

const TjenesteInfo = (props: TjenesteInfoProps) => {
    return (
        <li className="be-om-tilgang__tjenesteinfo">
            {props.erSyfo && <ModalLenke overskrift={props.overskrift} />}
            {!props.erSyfo && (
                <Element className="be-om-tilgang-lenke">
                    <Lenke
                        target="_blank"
                        href={props.lenkeTilBeOmTjeneste}
                        onClick={() => loggTjenesteTrykketPa('Be om tilgang-' + props.overskrift)}
                    >
                        <span>{props.overskrift + ' - be om tilgang'}</span><NyFaneIkon/>
                    </Lenke>
                </Element>
            )}
            <Normaltekst>
                {props.innholdstekst}
            </Normaltekst>
        </li>
    );
};

export default TjenesteInfo;
