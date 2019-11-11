import React, { FunctionComponent } from 'react';
import './AltinnLenke.less';
import Lenkepanel from 'nav-frontend-lenkepanel';
import nyfane from './nyfane.svg';
import { loggAtKlikketPa } from '../../Hovedside';

interface Props {
    className?: string;
    href: string;
    tekst: string;
}

const AltinnLenke: FunctionComponent<Props> = props => {
    const loggAtKlikketPaAltinn = () => {
        loggAtKlikketPa(props.tekst);
    };

    return (
        <div onClick={loggAtKlikketPaAltinn}>
            <Lenkepanel
                className={props.className}
                href={props.href}
                tittelProps={'element'}
                border={false}
                linkCreator={(props: any) => (
                    <a target="_blank" {...props}>
                        {props.children}
                    </a>
                )}
            >
                {props.tekst}
                <img
                    className={'altinn-container__ikon'}
                    src={nyfane}
                    alt="ikon for å beskrive at lenken åpnes i en ny fane"
                />
            </Lenkepanel>
        </div>
    );
};

export default AltinnLenke;
