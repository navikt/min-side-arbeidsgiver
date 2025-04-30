import { Notifikasjon } from '../../../api/graphql-types';
import React, { KeyboardEvent, ReactElement, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { BodyShort, Detail } from '@navikt/ds-react';
import { sendtDatotekst } from '../../../utils/dato';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import './NotifikasjonElement.css';

interface NotifikasjonElementProps {
    notifikasjon: Notifikasjon;
    onKeyDown: (e: KeyboardEvent<HTMLAnchorElement>, id: string) => void;
    onFocus: () => void;
    isFocused: boolean;
    ikon: ReactElement;
    erTodo: boolean;
    tittel: string;
    undertittel?: string;
    visningstidspunkt?: Date;
    statuslinje?: ReactElement;
    handleKlikk: () => void;
}

const NotifikasjonElement = ({
    notifikasjon,
    onKeyDown,
    onFocus,
    isFocused,
    ikon,
    erTodo = false,
    tittel,
    undertittel,
    visningstidspunkt,
    statuslinje,
    handleKlikk,
}: NotifikasjonElementProps) => {
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (isFocused && ref.current) {
            ref.current.focus();
        }
    }, [isFocused]);
    const { klikketPaa } = notifikasjon.brukerKlikk;
    return (
        <a
            onKeyDown={(e) => onKeyDown(e, notifikasjon.id)}
            onFocus={onFocus}
            tabIndex={0}
            ref={ref}
            href={notifikasjon.lenke}
            aria-label={tittel}
            onClick={handleKlikk}
        >
            <div className={clsx('notifikasjon-element', { fokusert: isFocused })} role="listitem">
                <div
                    className={clsx('notifikasjon-element-left-border', erTodo ? 'gul-border' : '')}
                />
                {klikketPaa && <BodyShort visuallyHidden>Ikke besøkt</BodyShort>}
                {<BodyShort visuallyHidden>{notifikasjon.__typename}</BodyShort>}
                <div className="notifikasjon-element-innhold">
                    {/** VIRKSOMHET **/}
                    <BodyShort size="small" spacing>
                        {notifikasjon.virksomhet.navn.toUpperCase()}
                    </BodyShort>

                    {/** SAK **/}
                    {notifikasjon.sak && notifikasjon.sak.tittel !== '' && (
                        <>
                            <BodyShort spacing>
                                {klikketPaa ? (
                                    notifikasjon.sak.tittel
                                ) : (
                                    <strong>{notifikasjon.sak.tittel}</strong>
                                )}
                            </BodyShort>
                            {notifikasjon.sak.tilleggsinformasjon !== '' && (
                                <BodyShort size="small" spacing>
                                    {notifikasjon.sak.tilleggsinformasjon}
                                </BodyShort>
                            )}
                        </>
                    )}

                    {/** NOTIFIKASJON **/}
                    <div className="notifikasjon-element-melding">
                        <div>{ikon}</div>
                        <div>
                            <div>
                                <BodyShort
                                    weight={klikketPaa ? 'regular' : 'semibold'}
                                    size="small"
                                    spacing
                                >
                                    {tittel}
                                </BodyShort>
                                {undertittel !== '' && (
                                    <BodyShort
                                        size="large"
                                        weight={klikketPaa ? 'regular' : 'semibold'}
                                    >
                                        {undertittel}
                                    </BodyShort>
                                )}
                            </div>
                            {visningstidspunkt && (
                                <Detail spacing>{sendtDatotekst(visningstidspunkt)}</Detail>
                            )}
                            <div>{statuslinje}</div>
                        </div>
                    </div>
                </div>
                <div className="notifikasjon-element-pil">
                    <ChevronRightIcon fontSize="2rem" aria-hidden />
                </div>
            </div>
        </a>
    );
};

export default NotifikasjonElement;
