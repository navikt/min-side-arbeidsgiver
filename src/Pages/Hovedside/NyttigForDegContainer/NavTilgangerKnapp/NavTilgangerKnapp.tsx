import React from 'react';
import { KeyHorizontalIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';
import { InternalLenkepanel } from '../../../../GeneriskeElementer/Lenkepanel';
import './NavTilgangerKnapp.css';

const NavTilgangerKnapp = () => (
    <InternalLenkepanel
        to={'/nav-tilganger'}
        onClick={() => scroll(0, 0)}
        className="nav-tilganger-knapp"
    >
        <div className="tittel-med-ikon">
            <div className="tittel-med-ikon-container">
                <KeyHorizontalIcon aria-hidden className="tittel-med-ikon__ikon" fontSize="1.5rem" />
            </div>
            <Heading size="small" level="2">
                Se mine Nav-tilganger
            </Heading>
        </div>
    </InternalLenkepanel>
);

export default NavTilgangerKnapp;
