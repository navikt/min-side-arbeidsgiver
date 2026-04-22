import React from 'react';
import bedriftinfoikon from '../Bedriftsinfoknapp/infoombedriftikon.svg';
import { InternalLenkepanel } from '../../../../GeneriskeElementer/Lenkepanel';
import { TittelMedIkon } from '../../../../GeneriskeElementer/TittelMedIkon';
import './NavTilgangerKnapp.css';

const NavTilgangerKnapp = () => (
    <InternalLenkepanel
        to={'/nav-tilganger'}
        onClick={() => scroll(0, 0)}
        className="nav-tilganger-knapp"
    >
        <TittelMedIkon tittel={'Se mine Nav-tilganger'} ikon={bedriftinfoikon} />
    </InternalLenkepanel>
);

export default NavTilgangerKnapp;
