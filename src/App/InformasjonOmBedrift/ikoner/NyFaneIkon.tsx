import React from 'react';
import {useId} from "@navikt/ds-react";

const NyFaneIkon = () => {
    const id = useId()
    return (
        <svg
            className="ny-fane-ikon"
            width="12"
            height="12"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby={id}
            role="img"
        >
            <title id={id}>Ekstern lenke. Åpnes i ny fane</title>
            <g
                stroke="#0067C5"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
            >
                <path d="M11 8v1.3c0 1-.7 1.7-1.7 1.7H2.7c-1 0-1.7-.7-1.7-1.7V2.7C1 1.7 1.7 1 2.7 1h1.2"/>
                <path d="M5 7l5-5" strokeWidth="2"/>
                <path fill="#0067C5" strokeLinejoin="round" d="M7 1h4v4z"/>
            </g>
        </svg>
    );
};

export default NyFaneIkon;



