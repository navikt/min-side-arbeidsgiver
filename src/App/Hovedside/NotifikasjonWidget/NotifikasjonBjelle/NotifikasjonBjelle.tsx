import React, { Ref } from 'react';
import './NotifikasjonBjelle.less';
import {Element} from "nav-frontend-typografi";
import {ReactComponent as Ikon} from "./NotifikasjonBjelle.svg";

interface Props {
    antallUleste?: number;
    erApen: boolean;
    onClick?: () => void;
    focusableRef: Ref<HTMLButtonElement>
}

export const NotifikasjonBjelle = (
    {
        antallUleste = 0,
        erApen,
        onClick,
        focusableRef
    }: Props
) => {

    return (
        <div className="notifikasjon_bjelle">
            <button
                ref={focusableRef}
                onClick={onClick}
                className={`notifikasjon_bjelle-knapp notifikasjon_bjelle-knapp${erApen ? '--open' : ''}`}
                aria-label={`Dine notifikasjoner, ${antallUleste} uleste.`}
                aria-owns="notifikasjon_panel"
                aria-haspopup="dialog"
                aria-pressed={erApen ? "true" : "false"}
            >
                <div className='notifikasjon_bjelle-ikon'>
                    <Ikon />

                    <div className={`notifikasjon_bjelle-ikon__ulest-sirkel ${antallUleste === 0 ? 'notifikasjon_bjelle-ikon__ulest-sirkel--hide' : ''}`}>
                        <Element className="notifikasjon_bjelle-ikon__ulest-antall">
                            {antallUleste < 10 ? antallUleste : '9+'}
                        </Element>
                    </div>
                </div>

            </button>
            <div className={`notifikasjon_bjelle-understrek ${(erApen ? '' : 'notifikasjon_bjelle-understrek--closed')}`}/>
        </div>
    );
};
