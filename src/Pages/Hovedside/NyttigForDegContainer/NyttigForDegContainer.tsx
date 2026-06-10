import React from 'react';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import NavTilgangerKnapp from './NavTilgangerKnapp/NavTilgangerKnapp';
import './NyttigForDegContainer.css';

const NyttigForDegContainer = () => (
    <div className="nyttig-for-deg">
        <div className="nyttig-for-deg__bokser">
            <div className="boks">
                <Bedriftsinfoknapp />
            </div>
            <div className="boks">
                <NavTilgangerKnapp />
            </div>
        </div>
    </div>
);

export default NyttigForDegContainer;
