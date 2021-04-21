import React, {useCallback, useEffect, useRef, useState} from 'react';
import {VarslerKnapp} from './varsler-knapp/VarslerKnapp';
import Varselpanel from './Varselpanel/Varselpanel';
import {Size, useWindowSize} from './useWindowSize';
import './Varsler.less';
import {inkluderVarslerFeatureToggle} from '../../../FeatureToggleProvider';
import {useQuery} from "@apollo/client";
import {HENT_NOTIFIKASJONER, HentNotifikasjonerData} from "../../../api/graphql";
import useLocalStorage from "../../hooks/useLocalStorage";

const Varsler = () => {
    if (!inkluderVarslerFeatureToggle) {
        return null
    }

    const [sistLest, _setSistLest] = useLocalStorage<string | undefined>("sist_lest", undefined);
    const { data } = useQuery<HentNotifikasjonerData, undefined>(
        HENT_NOTIFIKASJONER,
        {
            pollInterval: 60_000,
        }
    );
    const setSistLest = useCallback(() => {
        if (data?.notifikasjoner !== undefined && data?.notifikasjoner.length > 0) {
            // TODO: naiv impl forutsetter sortering
            _setSistLest(data.notifikasjoner[0].opprettetTidspunkt)
        }
    }, [data]);
    const antallUleste = (data?.notifikasjoner || []).filter(({opprettetTidspunkt}) => {
        if (sistLest === undefined) {
            return true
        } else {
            return new Date(opprettetTidspunkt).getTime() > new Date(sistLest).getTime()
        }
    }).length;
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
            <VarslerKnapp antallUlesteVarsler={antallUleste} erApen={erApen} setErApen={setErÅpenOgFokusPåFørsteVarsel} onApnet={() => setSistLest()} />
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
