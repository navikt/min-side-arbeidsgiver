import React from 'react';
import { useOrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.css';

const NyttigForDegContainer = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

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
