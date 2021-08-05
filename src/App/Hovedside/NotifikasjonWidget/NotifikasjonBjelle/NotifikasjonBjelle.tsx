import React from 'react';
import './NotifikasjonBjelle.less';
import {Element} from "nav-frontend-typografi";
import {ReactComponent as Ikon} from "./NotifikasjonBjelle.svg";

interface Props {
    antallUleste?: number;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    onApnet?: () => void;
}

export const NotifikasjonBjelle = (
    {
        antallUleste = 0,
        erApen,
        setErApen,
        onApnet = () => {
            // default noop
        }
    }: Props
) => {

    return (
        <div className="notifikasjon_bjelle">
            <button
                onClick={() => {
                    if (!erApen) {
                        onApnet()
                    }
                    setErApen(!erApen);
                }}
                className={`notifikasjon_bjelle-knapp notifikasjon_bjelle-knapp${erApen ? '--open' : ''}`}
                aria-label={`Du har ${antallUleste} uleste notifikasjoner.`}
                aria-controls="notifikasjon_liste"
                aria-expanded={erApen}
                aria-pressed={erApen}
                aria-haspopup="true"
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
