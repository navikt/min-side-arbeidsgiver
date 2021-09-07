import React, { FunctionComponent } from 'react';
import NyFaneIkon from '../NyFaneIkon';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

interface Props {
    className?: string;
    href: string;
    tekst: string;
    nyFane: boolean;
}

const AltinnLenke: FunctionComponent<Props> = props => {
    const nyFaneProp = props.nyFane ? "_blank" : "_self";

    return (
        <li className="altinn-lenke">
            <LenkepanelMedLogging
                href={props.href}
                loggTekst={`altinnskjema ${props.tekst}`}
                loggTjeneste={props.tekst}
                tittelProps={'element'}
                border={false}
                linkCreator={(props: any) => (
                    <a target={nyFaneProp} {...props}>
                        {props.children}
                    </a>
                )}
            >
                {props.tekst}{props.nyFane && <NyFaneIkon />}
            </LenkepanelMedLogging>
        </li>
    );
};

export default AltinnLenke;