import React, { FunctionComponent } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './SkjemaveilederContainer.less';
import { skjemaForArbeidsgivere } from '../../../lenker';
import AltinnLenke from '../AltinnContainer/AltinnLenke/AltinnLenke';

export const SkjemaveilederContainer: FunctionComponent = () => {
    return (
        <div className={'skjemaveilerderContainer'}>
            <div className={'skjemaveilerderContainer__tekst'}>
                <Undertittel>Alle søknader og skjemaer</Undertittel>
            </div>
            <AltinnLenke
                href={skjemaForArbeidsgivere}
                tekst={'Sende skjema eller ettersende dokumenter'}
                className={'skjemaveilerderContainer__lenkepanel'}
            >
                Sende skjema eller ettersende dokumenter
            </AltinnLenke>
        </div>
    );
};
