import React, { FunctionComponent } from 'react';

const SkjulteKolonner: FunctionComponent = () => {
    return (
        <tr className={'usynlig-kolonnerad'}>
            <th className={'th'} tabIndex={0} />
            <th className={'th'} tabIndex={0}>
                "a"
            </th>
            <th className={'th'} tabIndex={0}>
                "a"
            </th>
            <th className={'th'} tabIndex={0}>
                "a "
            </th>
            <th className={'tht'} tabIndex={0}>
                "a "
            </th>
            <th className={'th'} tabIndex={0}>
                "a "
            </th>
        </tr>
    );
};

export default SkjulteKolonner;
