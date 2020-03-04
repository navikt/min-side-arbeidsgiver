import React, { FunctionComponent } from 'react';
import './TjenesteInfo.less';
import nyfane from './nyfane.svg';

import { Element } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import ModalLenke from './ModalLenke/ModalLenke';

export interface TjenesteInfoProps {
    overskrift: string;
    innholdstekst: string;
    lenkeTilBeOmTjeneste: string;
    erSyfo?: boolean;
}

const TjenesteInfo: FunctionComponent<TjenesteInfoProps> = props => {
    return (
        <div className={'tjeneste-info'}>
            {props.erSyfo && <ModalLenke></ModalLenke>}

            {!props.erSyfo && (
                <Lenke
                    target="_blank"
                    className={'tjeneste-info__lenke'}
                    href={props.lenkeTilBeOmTjeneste}
                >
                    Be om tilgang <img src={nyfane} alt={' '} />{' '}
                </Lenke>
            )}
            <Element className={'tjeneste-info__overskrift'}>{props.overskrift}</Element>
            {props.innholdstekst}
        </div>
    );
};

export default TjenesteInfo;
