import React, { FunctionComponent } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './SkjemaveilederContainer.less';
import Lenkepanel from 'nav-frontend-lenkepanel/lib';
import { skjemaForArbeidsgivere } from '../../../lenker';

export const SkjemaveilederContainer: FunctionComponent = () => {
    return (
        <div className={'skjemaveilerderContainer'}>
            <div className={'skjemaveilerderContainer__tekst'}>
                <Undertittel>Alle søknader og skjemaer</Undertittel>
            </div>
            <Lenkepanel
                href={skjemaForArbeidsgivere}
                tittelProps={'element'}
                className={'skjemaveilerderContainer__lenkepanel'}
            >
                Sende skjema eller ettersende dokumenter
            </Lenkepanel>
        </div>
    );
};
