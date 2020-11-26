import React, { useEffect, useRef, useState } from 'react';
import { VarslerKnapp } from './varsler-knapp/VarslerKnapp';
import Varselpanel from './Varselpanel/Varselpanel';

const Varsler = () => {
    const varslernode = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);

    const handleOutsideClick: { (event: MouseEvent|KeyboardEvent): void } = (e: MouseEvent|KeyboardEvent) => {
        const node = varslernode.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    useEffect(() => {
        if (!erApen) {
            // setfokusPaMenyKnapp();
            // setOrganisasjonIFokus(tomAltinnOrganisasjon);
        }
        else {
            // setfokusPaSokefelt();
        }
    }, [erApen]);

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick, false);
        document.addEventListener('keydown', handleOutsideClick, false);
        return () => {
            window.removeEventListener('click', handleOutsideClick, false);
            window.removeEventListener('keydown', handleOutsideClick, false);
        };
    }, []);

    return (
        <div ref={varslernode} className="varsler">
            <VarslerKnapp erApen={erApen} setErApen={setErApen}/>
            {erApen &&
                <Varselpanel erApen={erApen} setErApen={setErApen}/>
            }
        </div>
    );
};

export default Varsler;
