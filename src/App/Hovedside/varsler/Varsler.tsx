import React, { useEffect, useRef, useState } from 'react';
import { VarslerKnapp } from './varsler-knapp/VarslerKnapp';
import Varselpanel from './Varselpanel/Varselpanel';
import { Size, useWindowSize } from './useWindowSize';
import './Varsler.less';
import { inkluderVarslerFeatureToggle } from '../../../FeatureToggleProvider';
import {useQuery} from "@apollo/client";
import {HENT_NOTIFIKASJONER, HentNotifikasjonerData} from "../../../api/graphql";

const Varsler = () => {
    if (!inkluderVarslerFeatureToggle) {
        return null
    }

    const { data } = useQuery<HentNotifikasjonerData, undefined>(
        HENT_NOTIFIKASJONER,
        {
            pollInterval: 10_000,
        }
    );
    const size: Size = useWindowSize();
    const varslernode = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);
    const [indeksVarselIFokus, setIndeksVarselIFokus] = useState(-1);

    const handleOutsideClick: { (event: MouseEvent | KeyboardEvent): void } = (
        e: MouseEvent | KeyboardEvent
    ) => {
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
        } else {
            setIndeksVarselIFokus(-1);
        }
        setErApen(åpen);
    };

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
            <VarslerKnapp erApen={erApen} setErApen={setErÅpenOgFokusPåFørsteVarsel} />
            <Varselpanel
                varsler={data?.notifikasjoner}
                erApen={erApen}
                setErApen={setErApen}
                indeksVarselIFokus={indeksVarselIFokus}
                setIndeksVarselIFokus={setIndeksVarselIFokus}
                dropdownouterheight={size.dropdown.outerheight}
                dropdowninnerheight={size.dropdown.innerheight}
            />
        </div>
    );
};

export default Varsler;
