import React from 'react';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.css';
import { useOrganisasjonsDetaljerContext } from '../../OrganisasjonsDetaljerContext';

const NyttigForDegContainer = () => (
    <div className="nyttig-for-deg">
        <div className="nyttig-for-deg__bokser">
            <div className="boks">
                <Bedriftsinfoknapp />
            </div>
        </div>
    </div>
);

export default NyttigForDegContainer;
