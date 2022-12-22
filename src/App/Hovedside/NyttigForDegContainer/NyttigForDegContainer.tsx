import React, { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.css';

const NyttigForDegContainer = () => {
    return (
        <div className="nyttig-for-deg">
            <div className="nyttig-for-deg__bokser">
                <div className="boks">
                    <Bedriftsinfoknapp />
                </div>
            </div>
        </div>
    );
};

export default NyttigForDegContainer;
