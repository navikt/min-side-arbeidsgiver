import { BodyShort, Label, LinkPanel } from '@navikt/ds-react';
import React from 'react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

export const SakPanel = ({sak: {lenke, tittel, virksomhet, sisteStatus}}: {sak: GQL.Sak}) => {
    return <LinkPanel href={lenke}>
        <BodyShort>
            {virksomhet.navn.toUpperCase() }
        </BodyShort>
        <LinkPanel.Title style={{margin: "0.2rem 0", fontSize: "1.3rem"}} >
            {tittel}
        </LinkPanel.Title>
        <BodyShort>
            {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
        </BodyShort>
    </LinkPanel>
}