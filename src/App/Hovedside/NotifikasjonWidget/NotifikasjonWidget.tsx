import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NotifikasjonBjelle} from './NotifikasjonBjelle/NotifikasjonBjelle';
import NotifikasjonListe from './NotifikasjonListe/NotifikasjonListe';
import './NotifikasjonWidget.less';
import {inkluderVarslerFeatureToggle} from '../../../FeatureToggleProvider';
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
    if (!inkluderVarslerFeatureToggle) {
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
        notifikasjoner.length > 0
            ? <div ref={varslernode} className="varsler">
                <NotifikasjonBjelle
                    antallUlesteVarsler={antallUleste}
                    erApen={erApen}
                    setErApen={setErÅpenOgFokusPåFørsteVarsel}
                    onApnet={() => setSistLest()} />
                <NotifikasjonListe
                    varsler={notifikasjoner}
                    erApen={erApen}
                    setErApen={setErApen}
                    indeksVarselIFokus={indeksVarselIFokus}
                    setIndeksVarselIFokus={setIndeksVarselIFokus}
                />
            </div>
            : null
    );
};

export default NotifikasjonWidget;
