import React, { FunctionComponent } from 'react';
import './AltinnLenke.less';
import Lenkepanel from 'nav-frontend-lenkepanel';
import nyfane from './nyfane.svg';

interface Props {
    className?: string;
    href: string;
    tekst: string;
    nyFane: boolean
}

const AltinnLenke: FunctionComponent<Props> = props => {
    const loggAtKlikketPaAltinn = () => {
        //loggNavigasjonTilTjeneste(props.tekst);
    };

    const nyFaneProp = props.nyFane ? "_blank" : "_self";
    console.log(nyFaneProp);
    console.log(nyfane, nyFaneProp);

    return (
        <div onClick={loggAtKlikketPaAltinn}>
            <Lenkepanel
                className={props.className}
                href={props.href}
                tittelProps={'element'}
                border={false}
                linkCreator={(props: any) => (
                    <a target={nyFaneProp} {...props}>
                        {props.children}
                    </a>
                )}
            >
                {props.tekst}
                {props.nyFane && <img
                    className={'altinn-container__ikon'}
                    src={nyfane}
                    alt="ikon for å beskrive at lenken åpnes i en ny fane"
                />}
            </Lenkepanel>
        </div>
    );
};

export default AltinnLenke;
