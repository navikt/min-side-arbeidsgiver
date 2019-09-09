import React, { FunctionComponent } from 'react';
import './MineAnsatte.less';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { Undertittel } from 'nav-frontend-typografi';

interface Props {
    className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
    return (
        <div className={'hovedside-mine-ansatte'}>
            <div className={'hovedside-mine-ansatte__innhold'}>
                <Undertittel className={'hovedside-mine-ansatte__systemtittel'} tabIndex={0}>
                    Opplysninger fra Aa-registeret
                </Undertittel>
                <TabellMineAnsatte className={'arbeidsforhold-table'} />
            </div>
        </div>
    );
};

export default MineAnsatte;
