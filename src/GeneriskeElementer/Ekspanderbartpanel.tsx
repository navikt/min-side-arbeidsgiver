import { Heading, Panel } from '@navikt/ds-react';
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@navikt/aksel-icons';
import React, { FC, useState, MouseEventHandler, PropsWithChildren } from 'react';

import './Ekspanderbartpanel.css';

export type Props = {
    tittel: string;
    ikon?: React.ReactNode;
    apen?: boolean;
};

export const Ekspanderbartpanel: FC<PropsWithChildren<Props>> = ({ children, tittel, ikon }) => {
    const [showing, setShowing] = useState(false);

    return (
        <Panel border className="ekspanderbartpanel">
            <Header
                onClick={() => setShowing(!showing)}
                apen={showing}
                tittel={tittel}
                ikon={ikon}
            ></Header>

            {showing && <div className="ekspanderbartpanel__content">{children}</div>}
        </Panel>
    );
};

interface HeaderProps {
    ikon?: React.ReactNode;
    tittel: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    apen: boolean;
}

const Header: FC<PropsWithChildren<HeaderProps>> = ({ ikon, tittel, onClick, apen }) => {
    return (
        <button className="ekspanderbartpanel__button" onClick={onClick} aria-expanded={apen}>
            {ikon !== undefined ? (
                <div className={'ekspanderbartpanel__button-ikon'}>{ikon}</div>
            ) : null}
            <Heading className="ekspanderbartpanel__button-tittel" size="small" level="2">
                {' '}
                {tittel}{' '}
            </Heading>
            <div className="ekspanderbartpanel__button-chevron">
                {apen ? (
                    <ChevronUpIcon title="Kollapsikon" aria-hidden="true" />
                ) : (
                    <ChevronUpDownIcon title="Ekspanderikon" aria-hidden="true" />
                )}
            </div>
        </button>
    );
};
