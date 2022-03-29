import { BodyShort, LinkPanel } from '@navikt/ds-react';
import React from 'react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';

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
    return <LinkPanel href={lenke} as={fake ? 'div' : 'a'}>
        <BodyShort style={style}>
            {virksomhet.navn.toUpperCase()}
        </BodyShort>
        <LinkPanel.Title style={{...style, margin: "0.2rem 0", fontSize: "1.3rem"}} >
            {tittel}
        </LinkPanel.Title>
        <BodyShort style={style}>
            {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
        </BodyShort>
    </LinkPanel>
}