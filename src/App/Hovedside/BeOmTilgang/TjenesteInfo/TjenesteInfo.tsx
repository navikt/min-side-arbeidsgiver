import React from 'react';
import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import ModalLenke from './ModalLenke/ModalLenke';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import nyfane from './nyfane.svg';
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
        <div className="tjeneste-info">
            {props.erSyfo && <ModalLenke />}
            {!props.erSyfo && (
                <Lenke
                    target="_blank"
                    className="tjeneste-info__lenke"
                    href={props.lenkeTilBeOmTjeneste}
                    onClick={() => loggTjenesteTrykketPa('Be om tilgang-' + props.overskrift)}
                >
                    <span>Be om tilgang</span> <img src={nyfane} alt="" />
                </Lenke>
            )}
            <Element className="tjeneste-info__overskrift">{props.overskrift}</Element>
            {props.innholdstekst}
        </div>
    );
};

export default TjenesteInfo;
