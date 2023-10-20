import React from 'react';
import './TjenesteBoksBanner.css';
import {Heading} from "@navikt/ds-react";

interface Props {
    imgsource: string;
    tittel: string;
    altTekst: string;
}

const TjenesteBoksBanner = (props: Props) => {
    return (
        <div className="tjeneste-boks-banner">
            <img
                className="tjeneste-boks-banner__ikon"
                src={props.imgsource}
                alt={props.altTekst}
            />
            <Heading size="small" level="2" className="tjeneste-boks-banner__tittel">{props.tittel}</Heading>
        </div>
    );
};

export default TjenesteBoksBanner;
