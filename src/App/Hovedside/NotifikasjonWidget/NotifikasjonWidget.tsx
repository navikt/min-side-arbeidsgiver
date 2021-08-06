import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NotifikasjonBjelle} from './NotifikasjonBjelle/NotifikasjonBjelle';
import NotifikasjonPanel from './NotifikasjonPanel/NotifikasjonPanel';
import './NotifikasjonWidget.less';
import {inkluderNotifikasjonerFeatureToggle} from '../../../FeatureToggleProvider';
import {ServerError, useQuery} from "@apollo/client";
import {HENT_NOTIFIKASJONER, HentNotifikasjonerData} from "../../../api/graphql";
import useLocalStorage from "../../hooks/useLocalStorage";
import {Beskjed} from "../../../api/graphql-types";

const uleste = (sistLest: string | undefined, notifikasjoner: Beskjed[]) : Beskjed[] => {
    if (sistLest === undefined) {
        return notifikasjoner;
    } else {
        return notifikasjoner.filter(({opprettetTidspunkt}) =>
            new Date(opprettetTidspunkt).getTime() > new Date(sistLest).getTime()
        )
    }
}

const NotifikasjonWidget = () => {
    if (!inkluderNotifikasjonerFeatureToggle) {
        return null
    }

    const [sistLest, _setSistLest] = useLocalStorage<string | undefined>("sist_lest", undefined);
    const {data, stopPolling} = useQuery<HentNotifikasjonerData, undefined>(
        HENT_NOTIFIKASJONER,
        {
            pollInterval: 60_000,
            onError(e) {
                if ((e.networkError as ServerError)?.statusCode == 401) {
                    console.log("stopper poll pga 401 unauthorized");
                    stopPolling();
                }
            }
        }
    );

    const setSistLest = useCallback(() => {
        if (data?.notifikasjoner !== undefined && data?.notifikasjoner.length > 0) {
            // naiv impl forutsetter sortering
            _setSistLest(data.notifikasjoner[0].opprettetTidspunkt)
        }
    }, [data]);

    const notifikasjoner = data?.notifikasjoner ?? [];
    const antallUleste = uleste(sistLest, notifikasjoner).length;

    const elementRef = useRef<HTMLDivElement>(null);
    const [erApen, setErApen] = useState(false);

    const handleFocusOutside: { (event: MouseEvent | KeyboardEvent): void } = (
        e: MouseEvent | KeyboardEvent
    ) => {
        const node = elementRef.current;
        // @ts-ignore
        if (node && node.contains(e.target as HTMLElement)) {
            return;
        }
        setErApen(false);
    };

    useEffect(() => {
        document.addEventListener('click', handleFocusOutside);
        return () => {
            document.removeEventListener('click', handleFocusOutside);
        };
    }, []);

    return (
        notifikasjoner.length > 0
            ? <div ref={elementRef} className="notifikasjoner_widget">
                <NotifikasjonBjelle
                    antallUleste={antallUleste}
                    erApen={erApen}
                    onClick={() => {
                        if (erApen) {
                            setErApen(false);
                        } else {
                            setSistLest()
                            setErApen(true);
                        }
                    }}
                />
                <NotifikasjonPanel
                    notifikasjoner={notifikasjoner}
                    erApen={erApen}
                    lukkPanel={() => {
                        setErApen(false);
                        // TODO: sett fokus på bjelle
                    }}
                />
            </div>
            : null
    );
};

export default NotifikasjonWidget;
