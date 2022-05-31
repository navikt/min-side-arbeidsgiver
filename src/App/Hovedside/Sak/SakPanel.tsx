import { BodyShort, LinkPanel } from '@navikt/ds-react';
import React from 'react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import {loggNavigasjon} from "../../../utils/funksjonerForAmplitudeLogging";
import {useLocation} from "react-router-dom";

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

type SakPanelProps = {
    sak: GQL.Sak;
    placeholder?: boolean;
}

export const SakPanel = ({placeholder, sak: {lenke, tittel, virksomhet, sisteStatus}}: SakPanelProps) => {
    const fake = placeholder ?? false
    const style: React.CSSProperties = fake ? {visibility: 'hidden'} : {}
    const { pathname } = useLocation()
    return <LinkPanel href={lenke} as={fake ? 'div' : 'a'} onClick={() => {
        loggNavigasjon(lenke, tittel, pathname)
    }}>
        <BodyShort size="small" style={style}>
            {virksomhet.navn.toUpperCase()}
        </BodyShort>

        <LinkPanel.Title style={{...style, fontSize: "1.1rem"}} >
            {tittel}
        </LinkPanel.Title>
        <BodyShort size="small" style={style}>
            {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
        </BodyShort>
    </LinkPanel>
}