import { PopoverBase, PopoverOrientering } from 'nav-frontend-popover';
import React, { FunctionComponent, useState } from 'react';
import './NotifikasjonInformasjon.less';
import { Helptext } from '@navikt/ds-icons';

// TODO:
// Trykke utenfor: lukk
// (?) Ytre notifikasjon-panel lukkes => lukk
// (?) Modal dialog? Tab-order? Wrap? Focus?
export const NotifikasjonInformasjon: FunctionComponent = () => {
    const [vis, setVis] = useState<boolean>(false);

    return <div className="notifikasjon-informasjon">

        <button className="notifikasjon-informasjon-knapp" onClick={() => setVis(!vis)}>
            <Helptext/>
            <span className="typo-normal">
                Hva vises her?
            </span>
        </button>

        <PopoverBase
            className={`notifikasjon-informasjon-popover ${vis ? 'notifikasjon-informasjon-popover__vis' : ''}`}
            orientering={PopoverOrientering.UnderHoyre}
        >
            Tjenesten er under utvikling og alle
            notifikasjoner vises ikke her ennå.
            Gamle notifikasjoner slettes etter hvert.
        </PopoverBase>
    </div>;
}
