import React, { FC, PropsWithChildren } from 'react';
import './Tjenesteboks.css';
import { Heading } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';

interface Props {
    ikon: string;
    href: string;
    tittel: string;
    'aria-label': string;
}

export const Tjenesteboks: FC<PropsWithChildren<Props>> = ({ ikon, href, tittel, children }) => {
    const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.href = href;
    };
    return (
        <a className="tjenesteboks" href={href} onClick={onClickHandler}>
            <div className="tjenesteboks-header">
                <Heading size="small" level="2">
                    {tittel}
                </Heading>
                <ChevronRightIcon
                    className="tjenesteboks-chevron"
                    width="2rem"
                    height="2rem"
                    aria-hidden={true}
                />
            </div>
            <div className="tjenesteboks-body">
                <div className="ikon-boks">
                    <img src={ikon} alt="" />
                </div>
                {children}
            </div>
        </a>
    );
};

export const StortTall: FC<PropsWithChildren> = ({ children }) => (
    <span className={'tjenesteboks__storttall'}>{children}</span>
);
