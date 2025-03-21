import React, { FC, PropsWithChildren, useEffect } from 'react';
import './Tjenesteboks.css';
import { Heading } from '@navikt/ds-react';
import amplitude from '../../../utils/amplitude';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { loggNavigasjon } from '../../../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';

interface Props {
    ikon: string;
    href: string;
    tittel: string;
    'aria-label': string;
}

export const Tjenesteboks: FC<PropsWithChildren<Props>> = (props) => {
    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'Tjenesteboks',
            lenketekst: props.tittel,
        });
    }, []);
    const onClickHandler = () => {
        const { pathname } = useLocation();
        loggNavigasjon(props.href, props.tittel, pathname);
    };
    return (
        <a className="tjenesteboks" href={props.href} onClick={onClickHandler}>
            <div className="tjenesteboks-header">
                <Heading size="small" level="2">
                    {props.tittel}
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
                    <img src={props.ikon} alt="" />
                </div>
                {props.children}
            </div>
        </a>
    );
};

export const StortTall: FC<PropsWithChildren> = (props) => {
    return <span className={'tjenesteboks__storttall'}>{props.children}</span>;
};
