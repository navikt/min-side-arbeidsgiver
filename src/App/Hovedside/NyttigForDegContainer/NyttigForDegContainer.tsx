import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Bedriftsinfoknapp from './Bedriftsinfoknapp';
import './NyttigForDegContainer.css';

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
            </div>
        </div>
    );
};

export default NyttigForDegContainer;
