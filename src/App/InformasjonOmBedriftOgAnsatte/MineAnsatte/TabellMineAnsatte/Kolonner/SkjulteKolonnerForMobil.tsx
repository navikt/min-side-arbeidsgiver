import React, { FunctionComponent } from 'react';

const SkjulteKolonner: FunctionComponent = () => {
    return (
        <tr className={'usynlig-kolonnerad'}>
            <th className={'th-skjult'} tabIndex={0} />
            <th className={'th-skjult'} tabIndex={0}>
                " "
            </th>
            <th className={'th-skjult'} tabIndex={0}>
                " "
            </th>
            <th className={'th-skjult'} tabIndex={0}>
                " "
            </th>
            <th className={'th-skjult'} tabIndex={0}>
                " "
            </th>
            <th className={'th-skjult'} tabIndex={0}>
                " "
            </th>
        </tr>
    );
};

export default SkjulteKolonner;
