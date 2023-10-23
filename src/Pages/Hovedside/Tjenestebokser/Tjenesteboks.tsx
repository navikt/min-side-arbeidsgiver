import React, { FC } from 'react';
import { LenkepanelMedLogging } from '../../../GeneriskeElementer/LenkepanelMedLogging';
import './Tjenesteboks.css';
import { Heading } from '@navikt/ds-react';

interface Props {
    ikon: string;
    href: string;
    tittel: string;
    'aria-label': string;
}

export const Tjenesteboks: FC<Props> = (props) => (
    <div className="tjenesteboks">
        <div className="tjenesteboks-innhold">
            <div className="tjeneste-boks-banner">
                <img className="tjeneste-boks-banner__ikon" src={props.ikon} alt="" />
                <Heading size="small" level="2" className="tjeneste-boks-banner__tittel">
                    {props.tittel}
                </Heading>
            </div>
            <LenkepanelMedLogging
                loggLenketekst={props.tittel}
                href={props.href}
                aria-label={props['aria-label']}
                border={false}
                className={'tjenesteboks__lenkepanel'}
            >
                {props.children}
            </LenkepanelMedLogging>
        </div>
    </div>
);

export const StortTall: FC = (props) => {
    return <span className={'tjenesteboks__storttall'}>{props.children}</span>;
};
