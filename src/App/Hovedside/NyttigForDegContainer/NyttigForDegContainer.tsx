import React, { FunctionComponent, useContext } from 'react';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.less';
import KontaktOss from './KontaktOss/KontaktOss';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { tomAltinnOrganisasjon } from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

const NyttigForDegContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className={'nyttig-for-deg'}>
            <div className={'nyttig-for-deg__bokser'}>
                {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <div className={'nyttig-for-deg__boks-to'}>
                        <Bedriftsinfoknapp />
                    </div>
                )}
                <div className={'nyttig-for-deg__boks-to'}>
                    <KontaktOss />
                </div>
            </div>
        </div>
    );
};

export default NyttigForDegContainer;
