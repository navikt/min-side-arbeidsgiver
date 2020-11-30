import React, { useEffect, useRef, useState } from 'react';
import { VarslerKnapp } from './varsler-knapp/VarslerKnapp';
import Varselpanel from './Varselpanel/Varselpanel';
import './Varsler.less';

const Varsler = () => {
    const varslernode = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);
    const [indeksVarselIFokus, setIndeksVarselIFokus] = useState(-1)

    const handleOutsideClick: { (event: MouseEvent|KeyboardEvent): void } = (e: MouseEvent|KeyboardEvent) => {
        const node = varslernode.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    const setErÅpenOgFokusPåFørsteVarsel = (åpen: boolean) => {
        if (åpen) {
            setIndeksVarselIFokus(0);
        }
        else {
            setIndeksVarselIFokus(-1);
        }
        setErApen(åpen)
    }

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
            <VarslerKnapp erApen={erApen} setErApen={setErÅpenOgFokusPåFørsteVarsel}/>
            <Varselpanel erApen={erApen} setErApen={setErApen} indeksVarselIFokus={indeksVarselIFokus} setIndeksVarselIFokus={setIndeksVarselIFokus} />
        </div>
    );
};

export default Varsler;
