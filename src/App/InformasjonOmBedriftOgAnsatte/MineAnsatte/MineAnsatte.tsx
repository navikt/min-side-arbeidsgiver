import React, { FunctionComponent, useContext } from 'react';
import './MineAnsatte.less';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { Undertittel } from 'nav-frontend-typografi';
import ListeMedAnsatteForMobil from './TabellMineAnsatte/ListeMineAnsatteForMobil/ListeMineAnsatteForMobil';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

interface Props {
    className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
    const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
    return (
        <>
            <Undertittel className={'hovedside-mine-ansatte__systemtittel'} tabIndex={0}>
                Opplysninger fra Aa-registeret
            </Undertittel>
            <TabellMineAnsatte className={'arbeidsforhold-table'} />
            <ListeMedAnsatteForMobil
                listeMedArbeidsForhold={mineAnsatte}
                className={'arbeidsforhold-liste'}
            />
        </>
    );
};

export default MineAnsatte;
