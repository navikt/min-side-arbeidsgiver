import React, { FunctionComponent, useContext } from 'react';
import './MineAnsatte.less';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import SideBytter from './BlaIAnsatte/BlaIAnsatte';
import VisningAvSideBytter from './BlaIAnsatte/VisningAvPageTurner';

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
            <VisningAvSideBytter />
            <div tabIndex={0} className={'mine-ansatte__antall'}>
                {mineAnsatte.arbeidsforholdoversikter.length} arbeidsforhold
            </div>
        </div>
    );
};

export default MineAnsatte;
