import {Heading, Panel} from '@navikt/ds-react';
import {Collapse as CollapseIcon, Expand as ExpandIcon} from '@navikt/ds-icons';
import React, {FC, useState, MouseEventHandler} from 'react';
import {Collapse} from 'react-collapse';

import "./Ekspanderbartpanel.css";

export type Props = {
    className?: string;
    tittel: string;
    ikon?: React.ReactNode;
    apen?: boolean;

}

export const Ekspanderbartpanel: FC<Props> = ({className, children, tittel, ikon}) => {
    const [showing, setShowing] = useState(false)

    return <Panel border className="ekspanderbartpanel">
        <Header
            onClick={() => setShowing(!showing)}
            apen={showing}
            tittel={tittel}
            ikon={ikon}
        >
        </Header>

        <Collapse isOpened={showing}>
            <div className={`ekspanderbartpanel__content ${className}`}>
                {children}
            </div>
        </Collapse>
    </Panel>
}

//TODO: Aligne ikoner
//TODO: Ikke tabbe inni kolapset panel
//TODO: Slette ubrukt css fra der ekspanderbart panel blir brukt.
interface HeaderProps {
    ikon?: React.ReactNode;
    tittel: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    apen: boolean;
}

const Header: FC<HeaderProps> =
    (
        {
            ikon,
            tittel,
            onClick,
            apen
        }
    ) => {
        return (
            <button
                className="ekspanderbartpanel__button"
                onClick={onClick}
                aria-expanded={apen}
            >
                        {ikon}
                        <Heading className="ekspanderbartpanel__button-tittel" size="small" level="2" as="span"> {tittel} </Heading>
                <div className="ekspanderbartpanel__button-chevron">{apen ? <CollapseIcon/> : <ExpandIcon/>}</div>
            </button>
        );
    }
