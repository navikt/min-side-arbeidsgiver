import React from 'react';
import { Element } from 'nav-frontend-typografi';
import ModalLenke from './ModalLenke/ModalLenke';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import './TjenesteInfo.less';
import NyFaneLenke from '../../../../GeneriskeElementer/NyFaneLenke';

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
                <NyFaneLenke
                    className="tjeneste-info__lenke"
                    href={props.lenkeTilBeOmTjeneste}
                    onClick={() => loggTjenesteTrykketPa('Be om tilgang-' + props.overskrift)}
                >
                    Be om tilgang
                </NyFaneLenke>
            )}
            <Element className="tjeneste-info__overskrift">{props.overskrift}</Element>
            {props.innholdstekst}
        </div>
    );
};

export default TjenesteInfo;
