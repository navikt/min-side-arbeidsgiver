import { PopoverBase, PopoverOrientering } from 'nav-frontend-popover';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import './NotifikasjonInformasjon.less';
import { Helptext } from '@navikt/ds-icons';

interface NotifikasjonInformasjonProps {
    onTabEvent?: (shiftKey: boolean, event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const NotifikasjonInformasjon: FunctionComponent<NotifikasjonInformasjonProps> = (props) => {
    const [vis, setVis] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    /* ref needed because handler is global (doesn't follow react) */
    const visRef = useRef(vis);

    useEffect(() => {
        visRef.current = vis;

        if (vis) {
            popoverRef.current?.scrollIntoView(false);
        }
    }, [vis])


    const onClickAnywhere = (e: MouseEvent) => {
        if (!visRef.current) {
            return;
        }
        if (popoverRef.current === null) {
            return;
        }
        if (!popoverRef.current.contains(e.target as HTMLElement)) {
            setVis(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', onClickAnywhere);
        return () => {
            document.removeEventListener('click', onClickAnywhere);
        };
    }, []);

    return <div className="notifikasjon-informasjon">
        <button
            id="notifikasjon-informasjon-knapp"
            className="notifikasjon-informasjon-knapp"
            onClick={() => setVis(!vis)}
            onKeyDown={(event) => {
                if (event.key === 'Tab') {
                    props.onTabEvent?.(event.shiftKey, event)
                }
            }}
        >
            <Helptext/>
            <span className="typo-normal">
                Hva vises her?
            </span>
        </button>

        <PopoverBase
            className={`notifikasjon-informasjon-popover ${vis ? 'notifikasjon-informasjon-popover__vis' : ''}`}
            orientering={PopoverOrientering.UnderHoyre}
            innerRef={popoverRef}
        >
            Tjenesten er under utvikling og alle
            notifikasjoner vises ikke her ennå.
            Gamle notifikasjoner slettes etter hvert.
        </PopoverBase>
    </div>;
}
