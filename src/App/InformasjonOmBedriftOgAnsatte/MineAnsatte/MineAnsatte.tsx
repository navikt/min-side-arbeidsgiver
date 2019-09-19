import React, { FunctionComponent, useContext } from 'react';
import './MineAnsatte.less';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { Undertittel } from 'nav-frontend-typografi';
import ListeMedAnsatteForMobil from './ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import SideBytter from './BlaIAnsatte/BlaIAnsatte';

interface Props {
    className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    return (
        <div className={'mine-ansatte'}>
            <Undertittel className={'mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <SideBytter listeMedArbeidsForhold={mineAnsatte} className={'sidebytter'} />
            <div tabIndex={0} className={'mine-ansatte__antall'}>
                {mineAnsatte.length} arbeidsforhold
            </div>
        </div>
    );
};

export default MineAnsatte;
