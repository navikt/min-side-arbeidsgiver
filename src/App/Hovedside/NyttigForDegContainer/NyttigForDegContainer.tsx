import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import KontaktOss from './KontaktOss/KontaktOss';
import './NyttigForDegContainer.less';

const NyttigForDegContainer = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className="nyttig-for-deg">
            <div className="nyttig-for-deg__bokser">
                {valgtOrganisasjon !== undefined && (
                    <div className="boks">
                        <Bedriftsinfoknapp />
                    </div>
                )}
                <div className="boks">
                    <KontaktOss />
                </div>
            </div>
        </div>
    );
};

export default NyttigForDegContainer;
