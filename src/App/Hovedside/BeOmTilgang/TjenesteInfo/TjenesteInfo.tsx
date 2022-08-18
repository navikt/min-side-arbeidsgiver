import React, { FunctionComponent, MouseEventHandler, useState } from 'react';
import SyfoBeOmTilgangModalBoks from '../SyfoBeOmTilgangModalBoks/SyfoBeOmTilgangModalBoks';
import './TjenesteInfo.css';
import { altinntjeneste, AltinntjenesteId } from '../../../../altinn/tjenester';
import NyFaneIkon from './NyFaneIkon';
import { LenkeMedLogging } from '../../../../GeneriskeElementer/LenkeMedLogging';
import {BodyShort, HelpText, Tag} from "@navikt/ds-react";

interface TjenesteInfo {
    tittel: string;
    beskrivelse: string;
}

interface EnAltinnId {
    altinnId: AltinntjenesteId;
}

interface BeOmTilgangAction {
    eksternSide?: boolean; /* default value: false */
    href?: string;
    onClick?: MouseEventHandler<unknown>;
}

const hentInfo = (props: TjenesteInfo | EnAltinnId): [string, string] => {
    if ('altinnId' in props) {
        const tjeneste = altinntjeneste[props.altinnId]
        return [tjeneste.navn, tjeneste.beOmTilgangBeskrivelse]
    } else {
        return [props.tittel, props.beskrivelse]
    }
}

export const BeOmTilgangBoks = (props: (TjenesteInfo | EnAltinnId) & BeOmTilgangAction) => {
    const [tittel, beskrivelse] = hentInfo(props)

    const onClickAction: MouseEventHandler<unknown> = event => {
        if (props.href === undefined) {
            event.preventDefault();
        }
        if (props.onClick) {
            props.onClick(event);
        }
    };

    return (
        <>
            <LenkeMedLogging
                loggLenketekst={`be om tilgang-${tittel}`}
                href={props.href ?? ''}
                onClick={onClickAction}
                className="be-om-tilgang-lenke"
            >
                <span>{tittel} – be om tilgang</span>
                {props.eksternSide ?? false ? <NyFaneIkon /> : null}
            </LenkeMedLogging>
            <BodyShort>{beskrivelse}</BodyShort>
        </>
    );
};

export const BeOmSyfotilgang = () => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    return (
        <>
            <BeOmTilgangBoks
                tittel="Dine sykmeldte"
                beskrivelse="Gå til digitale sykmeldinger og følg opp sykmeldte du har ansvar for."
                onClick={() => setModalIsOpen(true)}
            />
            <SyfoBeOmTilgangModalBoks
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            />
        </>
    );
};

export interface AltinntilgangAlleredeSøktProps {
    altinnId: AltinntjenesteId;
    status: string;
    statusBeskrivelse: string;
    type: 'suksess' | 'info';
}

export const AltinntilgangAlleredeSøkt: FunctionComponent<AltinntilgangAlleredeSøktProps>
    = ({ altinnId , status, statusBeskrivelse, type}) => {
    return <>
        <div className="tilgang-sokt typo-element">
            <span>{altinntjeneste[altinnId].navn}</span>
            <Tag variant="info" size="medium" className="tilgang-sokt-etikett">
                <span className="tilgang-sokt-etikette-tekst">{status}</span>
                <HelpText className="tilgang-sokt-hjelp" >
                    {statusBeskrivelse}
                </HelpText>
            </Tag>
        </div>
        <BodyShort>{altinntjeneste[altinnId].beOmTilgangBeskrivelse}</BodyShort>
    </>
}

