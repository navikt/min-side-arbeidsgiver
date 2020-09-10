import React, { FunctionComponent } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import NyFaneIkon from '../NyFaneIkon';

interface Props {
    className?: string;
    href: string;
    tekst: string;
    nyFane: boolean;
}

const AltinnLenke: FunctionComponent<Props> = props => {
    const loggAtKlikketPaAltinn = () => {
        //loggNavigasjonTilTjeneste(props.tekst);
    };

    const nyFaneProp = props.nyFane ? "_blank" : "_self";

    return (
        <li className="altinn-lenke">
            <Lenkepanel
                href={props.href}
                tittelProps={'element'}
                border={false}
                onClick={loggAtKlikketPaAltinn}
                linkCreator={(props: any) => (
                    <a target={nyFaneProp} {...props}>
                        {props.children}
                    </a>
                )}
            >
                {props.tekst}{props.nyFane && <NyFaneIkon />}
            </Lenkepanel>
        </li>
    );
};

export default AltinnLenke;