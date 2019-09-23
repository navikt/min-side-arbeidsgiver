import React, { FunctionComponent } from 'react';
import './Innloggingstjenester.less';
import medisin from './medicine-capsule-1.svg';
import sok from './search.svg';
import soylediagram from './soylediagram.svg';
import skjema from './skjema.svg';
import { Element } from 'nav-frontend-typografi';

export const Innloggingstjenester: FunctionComponent = () => {
    return (
        <div className={'innloggingsside-tjenester'}>
            <div className={'innloggingsside-tjenester__tjeneste'}>
                <img
                    src={medisin}
                    alt={''}
                    className={'innloggingsside-tjenester__tjeneste-ikon'}
                />
                <Element>Dine sykmeldte </Element>
            </div>
            <div className={'innloggingsside-tjenester__tjeneste'}>
                <img
                    alt={''}
                    src={soylediagram}
                    className={'innloggingsside-tjenester__tjeneste-ikon'}
                />
                <Element>Sykefraværsstatistikk </Element>
            </div>
            <div className={'innloggingsside-tjenester__tjeneste'}>
                <img src={sok} alt={''} className={'innloggingsside-tjenester__tjeneste-ikon'} />
                <Element>Rekruttere </Element>
            </div>
            <div className={'innloggingsside-tjenester__tjeneste'}>
                <img alt={''} src={skjema} className={'innloggingsside-tjenester__tjeneste-ikon'} />
                <Element>Digitale skjemaer </Element>
            </div>
        </div>
    );
};
