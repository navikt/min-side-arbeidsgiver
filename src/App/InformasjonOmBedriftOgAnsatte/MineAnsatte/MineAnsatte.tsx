import React, { FunctionComponent, useContext, useState } from 'react';
import './MineAnsatte.less';
import TabellMineAnsatte from './TabellMineAnsatte/TabellMineAnsatte';
import { Innholdstittel, Systemtittel } from 'nav-frontend-typografi';

interface Props {
    className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
    return (
        <div className={'hovedside-mine-ansatte'}>
            <Innholdstittel className={'hovedside-mine-ansatte__innholdstittel'}>
                Bedriftsprofil og ansatte
            </Innholdstittel>
            <div className={'hovedside-mine-ansatte__innhold'}>
                <Systemtittel className={'hovedside-mine-ansatte__systemtittel'}>
                    Opplysninger fra Aa-registeret
                </Systemtittel>
                <TabellMineAnsatte className={'arbeidsforhold-table'} />
            </div>
        </div>
    );
};

export default MineAnsatte;
