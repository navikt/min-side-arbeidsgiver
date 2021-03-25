import React from 'react';
import { Element } from 'nav-frontend-typografi';
import './VarselIkon.less';

type Props = {
    isOpen: boolean;
    antallUleste?: number;
};

export const VarselIkon = ({ isOpen, antallUleste = 0 }: Props) => {
    return (
        <div
            className={`varselbjelle-ikon${isOpen ? ` varselbjelle-ikon--open` : ''}`}
        >
            <div className="varselbjelle-ikon__ring" />
            <div className="varselbjelle-ikon__bell"/>
            <div className="varselbjelle-ikon__lip" />
            <div className="varselbjelle-ikon__clapper" />
            <div
                className={`varselbjelle-ikon__ulest-sirkel${antallUleste === 0 ? '--hide' : ''}`}
            >
                <Element className="varselbjelle-ikon__ulest-antall">
                    {antallUleste < 10 ? antallUleste : '9+'}
                </Element>
            </div>
        </div>
    );
};
