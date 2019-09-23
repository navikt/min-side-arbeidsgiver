import React, { FunctionComponent, useContext } from 'react';
import './MineAnsatte.less';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import SideBytter from './BlaIAnsatte/BlaIAnsatte';

interface Props {
    className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
    return (
        <div className={'mine-ansatte'}>
            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <SideBytter className={'sidebytter'} />
        </div>
    );
};

export default MineAnsatte;
