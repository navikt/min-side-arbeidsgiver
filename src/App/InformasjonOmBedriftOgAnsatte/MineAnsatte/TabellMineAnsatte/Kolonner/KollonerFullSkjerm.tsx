import React, { FunctionComponent } from 'react';

const KolonnerFullSkjerm: FunctionComponent = () => {
    return (
        <tr className="synlig-kolonnerad">
            <th className={'th'} tabIndex={0}>
                Navn
            </th>
            <th className={'th'} tabIndex={0}>
                Fødselsnummer
            </th>
            <th className={'th'} tabIndex={0}>
                Yrke
            </th>
            <th className={'th'} tabIndex={0}>
                Startdato
            </th>
            <th className={'th'} tabIndex={0}>
                Sluttdato
            </th>
            <th className={'th'} tabIndex={0}>
                Varsel
            </th>
        </tr>
    );
};

export default KolonnerFullSkjerm;
